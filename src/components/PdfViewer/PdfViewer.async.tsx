import { ComponentProps, FC, lazy, Suspense } from 'react';
export const PdfViewerAsync = lazy(() => import ('./PdfViewer'));

export const PdfViewer: FC<ComponentProps<typeof PdfViewerAsync>> = props => {
    return (
      <Suspense>
          <PdfViewerAsync {...props}/>
      </Suspense>
    )
}
