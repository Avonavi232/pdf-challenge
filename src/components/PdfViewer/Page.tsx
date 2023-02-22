import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListChildComponentProps } from 'react-window';
import { Page as PdfPage } from 'react-pdf';

import { TPageProps, TPDFPageProxy } from './types';

import styles from './styles.module.css';

export interface IListItemData extends TPageProps {
    setLoadTime(loadTime: number): void;
}

type TCustomPageProps = ListChildComponentProps<IListItemData>;

const PADDING_SIZE = 8;

function getTopOffset(rowIndex: number, rowTop: string) {
    return rowIndex === 0 ? rowTop : Number(rowTop) + rowIndex * PADDING_SIZE
}

export const Page = memo(forwardRef<HTMLDivElement, TCustomPageProps>((props, ref) => {
    const { index, style, data: { scale, setLoadTime } } = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ objectUrl, setObjectUrl ] = useState<string | null>(null);
    const dprRef = useRef(window.devicePixelRatio || 1);
    const loadTimeRef = useRef(performance.now());

    /**
     * Reinit rendering start point, when deps changed.
     * Deps must include values, which cause page redraw (ex. scale).
     * */
    useEffect(() => () => {
        loadTimeRef.current = performance.now();
    }, [ scale ])

    /** Cleanup when page is unmounted */
    useEffect(() => () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** The only 1st page's rendering time is considered */
    const measurePerformance = useCallback((page: TPDFPageProxy) => {
        if (page.pageNumber === 1) {
            const endTime = performance.now();
            setLoadTime(endTime - loadTimeRef.current);
        }
    }, [ setLoadTime ])

    /** Add additional gap between react-window rows */
    const preparedStyle = useMemo(() => ({
        ...style,
        top: getTopOffset(index, style.top as string),
    }), [ index, style ]);

    /**
     * Create an image from the canvas and hide (opacity=0) the canvas.
     * It solves the issue, when pdf is being resized, the canvas is flickering with black during rendering
     * */
    const renderSuccessHandler = useCallback((page: TPDFPageProxy) => {
        measurePerformance(page);

        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }

        canvas.toBlob((blob) => {
            const nextObjectUrl = URL.createObjectURL(blob!);
            setObjectUrl(nextObjectUrl);
        }, 'image/png');
    }, [ measurePerformance, objectUrl ])

    const canvas = canvasRef.current;
    const dpr = dprRef.current;

    return (
      <div
        ref={ref}
        style={preparedStyle}
      >
          <div className={styles['page_wrapper']}>
              <PdfPage
                {...props}
                className={styles['pdf_page']}
                scale={scale}
                pageIndex={index}
                canvasRef={canvas => {
                    canvasRef.current = canvas;
                }}
                onRenderSuccess={renderSuccessHandler}
              />
              {objectUrl && canvas &&
                  <img
                      className={styles['img']}
                      src={objectUrl}
                      width={canvas.width / dpr}
                      height={canvas.height / dpr}
                      alt=""
                  />
              }
          </div>
      </div>
    )
}));

Page.displayName = 'Page';
