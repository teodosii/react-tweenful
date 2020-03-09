import React from 'react';
import ObserverGroup from 'react-tweenful/ObserverGroup';

class GroupDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elements: ['red'] };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ elements: ['red', 'blue'] }), 2000);
  }

  render() {
    return (
      <div className="group-container">
        <ObserverGroup.ul
          config={{
            duration: 1200,
            style: { opacity: 0 },
            mount: { opacity: 1 },
            unmount: { opacity: 0 },
            easing: 'linear'
          }}
        >
          {this.state.elements.map(el => (
            <li key={el}>{el}</li>
          ))}
        </ObserverGroup.ul>
      </div>
    );
  }
}

export default GroupDemo;
