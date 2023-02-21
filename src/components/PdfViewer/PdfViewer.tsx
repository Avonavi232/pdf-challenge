import { FC, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { VariableSizeList } from 'react-window';
import { usePinch } from '@use-gesture/react';

import { LabeledInfo } from '../LabeledInfo';
import zoomInIcon from '../icons/zoomIn.svg';
import zoomOutIcon from '../icons/zoomOut.svg';
import { IconButton } from '../IconButton';
import { InfoText } from '../InfoText';
import { useIsFirstRender } from '../../utils/useIsFirstRender';
import { TPDFDocumentProxy } from './types';
import { Page, IListItemData } from './Page';
import { Document } from './Document';

import styles from './styles.module.css';
import { debounce } from 'throttle-debounce';
import { roundToPrecision } from '../../utils/roundToPrecision';
import { useScaleController } from './useScaleController';
import { usePerformanceState } from './usePerformanceState';
import { useResizeObserver } from './useResizeObserver';
import { usePreventDefaultOnTouch } from './usePreventDefaultOnTouch';

export interface IPdfViewerProps {
    url: string;
}

const PdfViewer: FC<IPdfViewerProps> = ({ url }) => {
    const listRef = useRef<VariableSizeList | null>(null);
    const contentRef = useRef<HTMLElement>(null);
    const [ contentRect, setContentRect ] = useState<DOMRect | null>(null);
    const [ pdf, setPdf ] = useState<TPDFDocumentProxy | null>(null);
    const currentPageRef = useRef<number | null>(null);
    const [ mounted, setMounted ] = useState<boolean>(false);
    const pageViewportsRef = useRef<TPageViewportsMap | null>(null);
    const isFirstRender = useIsFirstRender();

    usePreventDefaultOnTouch();

    const { loadTime, setLoadTime } = usePerformanceState();

    const {
        scaleState,
        scaleRef,
        zoomInHandler,
        zoomOutHandler,
        debouncedZoomHandler,
        setScale
    } = useScaleController();

    /**
     * Cache all page's viewports in advance, so we will know all the dimensions
     * Viewports are dependent on the scale, so viewports will be recalculated when scale changes
     * */
    const cachePageViewports = useCallback(async (pdf: TPDFDocumentProxy) => {
        const promises = Array.from({ length: pdf.numPages }, (v, i) => i + 1).map((pageNumber) => {
            return pdf.getPage(pageNumber);
        });

        return Promise.all(promises).then((pages) => {
            const pageDimensions: TPageViewportsMap = new Map();

            for (const page of pages) {
                const pageViewport = page.getViewport({ scale: scaleState });
                pageDimensions.set(page.pageNumber, [ pageViewport.width, pageViewport.height ]);
            }

            setMounted(true);
            pageViewportsRef.current = pageDimensions;
        });
    }, [ scaleState ]);

    /**
     * Cache content box dimensions for adaptivity reasons
     * */
    const cacheContentRect = useCallback(() => {
        const contentEl = contentRef.current!;
        const bRect = contentEl.getBoundingClientRect();
        setContentRect(bRect);
    }, []);

    const cacheContentRectDebounced = useMemo(() => debounce(300, cacheContentRect), [ cacheContentRect ]);

    const onDocumentLoadSuccess = useCallback((pdf: TPDFDocumentProxy) => {
        setPdf(pdf);
        cachePageViewports(pdf);
        cacheContentRect();
    }, []);

    /** Returns the height of a row for proper working of react-window */
    const getRowHeight = useCallback((pageIndex: number) => {
        const pageViewports = pageViewportsRef.current;
        const fallbackValue = 500;

        if (!pageViewports) {
            return fallbackValue;
        }

        const pageViewport = pageViewports.get(pageIndex + 1);

        return pageViewport ? pageViewport[1] : fallbackValue;
    }, []);

    /** The itemData prop value is cached for optimization reasons */
    const rowItemData = useMemo<IListItemData>(() => ({ scale: scaleState, setLoadTime }), [ scaleState, setLoadTime ]);

    /** Trigger caching of content box on mount */
    useEffect(() => {
        cacheContentRect();
    }, []);

    /**
     * When the scale has changed, we should recalculate pages viewports
     * and then trigger react-window to recalculate inner state
     * */
    useEffect(() => {
        (async () => {
            if (!isFirstRender) {
                await cachePageViewports(pdf!);
                listRef.current!.resetAfterIndex(0);
            }
        })()
    }, [ scaleState ]);

    usePinch(state => {
        /** To be optimized */
        setScale(state.offset[0]);
    }, { target: document.body });

    /**
     * When page is resized, we recalculate the scale in order to fit the current page to the browser's viewport
     * */
    const resizeObserverCallback = useCallback(() => {
        const currentPage = currentPageRef.current;
        const pageViewports = pageViewportsRef.current;
        const content = contentRef.current;
        const scale = scaleRef.current;

        cacheContentRectDebounced();

        if (!content || !pageViewports || !currentPage) {
            return;
        }

        const currentPageViewport = pageViewports.get(currentPage);

        if (!currentPageViewport) {
            return;
        }

        const adaptiveScale = contentRef.current.clientWidth / currentPageViewport[0];

        debouncedZoomHandler(roundToPrecision(adaptiveScale * scale, 3));
    }, [cacheContentRectDebounced, debouncedZoomHandler, scaleRef]);

    useResizeObserver(contentRef.current, resizeObserverCallback);

    return (
      <div className={styles['container']}>
          <header className={styles['header']}>
              <div className={styles['info']}>
                  <LabeledInfo label="LOADED URL">
                      <InfoText className={styles['loaded_url_info']}>
                          {url}
                      </InfoText>
                  </LabeledInfo>
                  {loadTime && (
                    <LabeledInfo label="RENDER TIME">
                        <span>{loadTime}</span>
                    </LabeledInfo>
                  )}
              </div>
              <div className={styles['zoom_controls']}>
                  <IconButton icon={zoomOutIcon} onClick={zoomOutHandler}/>
                  <IconButton icon={zoomInIcon} onClick={zoomInHandler}/>
              </div>
          </header>

          <main ref={contentRef} className={styles['content_wrapper']}>
              <Document
                className={styles['pdf_document']}
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                  {mounted && contentRect && (
                    <VariableSizeList
                      width="100%"
                      height={contentRect.height}
                      itemCount={pdf!.numPages}
                      itemSize={getRowHeight}
                      itemData={rowItemData}
                      overscanCount={2}
                      ref={listRef}
                      onItemsRendered={({ visibleStartIndex }) => {
                          currentPageRef.current = visibleStartIndex + 1;
                      }}
                    >
                        {Page}
                    </VariableSizeList>
                  )}
              </Document>
          </main>
      </div>
    );
};

export default PdfViewer;

type TPageViewportsMap = Map<number, [ number, number ]>;
