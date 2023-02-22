import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { PdfViewer } from '../components/PdfViewer';
import testPdf from './test.pdf';

export default {
    title: 'Example/PdfViewer',
    component: PdfViewer,
    parameters: { layout: 'fullscreen' },
} as ComponentMeta<typeof PdfViewer>;

export const Example = () => {
    return (
      <div style={{ height: 700 }}>
          <PdfViewer url={testPdf}/>
      </div>
    )
};
