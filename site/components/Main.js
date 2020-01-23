import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Tweenful from 'react-tweenful';
import highlight from 'site/highlight';

const Main = () => {
  return (
    <article className="main-content">
      <h1 className="heading">Quick Start</h1>
      <p className="lead">As a complete and self-sufficient web framework, Kube is here to help you get the most out of your daily work. Kube takes care of routine stuff, saving you precious time for things that you love. Starting up with Kube is ridiculously fast — you can start in under a minute.</p>
      <a href="/" className="spacer-top button primary">Download</a>
      <h2 className="heading">Supported Browsers</h2>
      <p className="lead">Kube supports the latest, stable releases of all major browsers:</p>
      <ul className="list">
        <li>Latest Chrome</li>
        <li>Latest Firefox</li>
        <li>Latest Safari</li>
        <li>Microsoft Edge</li>
      </ul>
      <h2 className="heading">Examples</h2>
      <div className="animate-box">
        <Tweenful.div
          className="box"
          duration={2000}
          easing="easeInOutCubic"
          animate={[
            { translateX: '200px' },
            { translateX: '-200px' },
            { translateX: '0px' }
          ]}
          loop={false}
        ></Tweenful.div>
      </div>
      <div className="code-highlight">
        <SyntaxHighlighter style={atomDark} language="jsx">
          {highlight.demo}
        </SyntaxHighlighter>
      </div>
    </article>
  );
};

export default Main;