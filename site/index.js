import React from 'react';
import ReactDOM from 'react-dom';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import Application from './components/App';
import './style/global.scss';

window.addEventListener('DOMContentLoaded', () => {
  SyntaxHighlighter.registerLanguage('jsx', jsx);
});

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === "interactive") {
    // DOM accessible
  }

  if (event.target.readyState === "complete") {
    ReactDOM.render(<Application />, document.getElementsByClassName('app')[0]);
  }
});
