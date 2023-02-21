import React, { FC } from 'react';
import { PdfViewer } from './components/PdfViewer';

export const App: FC<{ url: string }> = ({ url }) => {
    return (
      <div className="App">
          <PdfViewer url={url}/>
      </div>
    );
}
