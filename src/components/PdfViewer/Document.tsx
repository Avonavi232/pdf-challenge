import { FC } from 'react';
import { Document as PdfDocument } from 'react-pdf';

import './styles.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { TDocumentProps } from './types';

const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
};

export const Document: FC<TDocumentProps> = props => {
    return (
      <PdfDocument {...props} options={options}/>
    );
};
