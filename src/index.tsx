import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
// import testPdf from './StatementOfReturn.pdf';
import testPdf from './test.pdf'; //Example of large pdf doc

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App url={testPdf}/>
);
