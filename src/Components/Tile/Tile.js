import React, { Component } from 'react';
import './tile.css';


export default class Tile extends Component {
  constructor(props) {
    super(props);
  }

  ComponentShouldUpdate() {
    return false;
  }

  render() {
    return (
      <div className={ `tile tile-${this.props.type}` } />
    );
  }
}
