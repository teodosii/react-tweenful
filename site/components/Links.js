import React from 'react';
import { Link } from 'react-router-dom';

const Links = () => {
  return (
    <div className="links">
      <h3 className="links-heading">Navigate to an example</h3>
      <ul className="links-list">
        <li>
          <Link to="react-tweenful/notifications">Notifications</Link>
        </li>
        <li>
          <Link to="react-tweenful/transition">Route transition</Link>
        </li>
        <li>
          <Link to="react-tweenful/observer">Observer</Link>
        </li>
        <li>
          <Link to="react-tweenful/svg">SVG</Link>
        </li>
        <li>
          <Link to="react-tweenful/loading-circles">Loader</Link>
        </li>
        <li>
          <Link to="react-tweenful/rotating-svg">Prism</Link>
        </li>
        <li>
          <Link to="react-tweenful/gradients">Gradients</Link>
        </li>
        <li>
          <Link to="react-tweenful/bouncing-balls">Bouncing Balls</Link>
        </li>
      </ul>
    </div>
  );
};

export default Links;
