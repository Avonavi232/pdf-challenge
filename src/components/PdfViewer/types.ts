import { ComponentProps } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

export type TDocumentProps = ComponentProps<typeof Document>;
export type TPageProps = ComponentProps<typeof Page>;
export type TPDFDocumentProxy = pdfjs.PDFDocumentProxy;
export type TPDFPageProxy = pdfjs.PDFPageProxy;
