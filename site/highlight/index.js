export default {
  demo: `import React from "react";
import uniquePropHOC from "./lib/unique-prop-hoc";
  
class Expire extends React.Component {
  constructor(props) {
    super(props);
    this.state = { component: props.children };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        component: null
      });
    }, this.props.time || this.props.seconds * 1000);
  }
  render() {
    return this.state.component;
  }
}
  
export default uniquePropHOC(["time", "seconds"])(Expire);`
};
