import React from "react";

interface Props {
  cacheName: string;
}

interface State {}

const cache = new Map();
export default class ElementCache extends React.Component<Props, State> {
  render() {
    return (
      <React.Fragment>
        {cache.has(this.props.cacheName)
          ? cache.get(this.props.cacheName)
          : this.props.children}
      </React.Fragment>
    );
  }

  componentDidUpdate() {
    if (cache.has(this.props.cacheName)) {
      return;
    }
    cache.set(this.props.cacheName, this.props.children);
  }
}
