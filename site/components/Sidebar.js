import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <h4 className="nav-header">Getting Started</h4>
        <ul className="nav-list">
          <li className="active"><a href="#quick-start">Quick Start</a></li>
          <li><a href="#ajax">Ajax</a></li>
          <li><a href="#api">API</a></li>
        </ul>

        <h4 className="nav-header">Modules</h4>
        <ul className="nav-list">
          <li className="active"><a href="#quick-start">Dropdown</a></li>
          <li><a href="#ajax">Breakpoint</a></li>
          <li><a href="#api">Color</a></li>
        </ul>

        <h4 className="nav-header">Services</h4>
        <ul className="nav-list">
          <li className="active"><a href="#quick-start">Navbar</a></li>
          <li><a href="#ajax">Form</a></li>
          <li><a href="#api">Grid</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;