import React, { Component } from 'react';
import Tile from '../Tile/Tile';
import createMap, { createForestMap, createLavaMap } from './generateMap';
import './map.css';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: createMap({
        height: 75,
        width: 75,
      }),
    };
    this.forestClick = this.forestClick.bind(this);
    this.lavaClick = this.lavaClick.bind(this);
  }

  forestClick(e) {
    e.preventDefault();
    this.setState({
      map: createForestMap(createMap({ height: 75, width: 75 })),
    });
  }

  lavaClick(e) {
    e.preventDefault();
    this.setState({
      map: createLavaMap(createMap({ height: 75, width: 75 })),
    });
  }

  render() {
    return (
      <div className="game">
        <button onClick={ this.forestClick } >Create Forest Map</button>
        <button onClick={ this.lavaClick } >Create Lava Map</button>
        {
          this.state.map.rows.map(row => (
            <div className="tile-row" key={ row.id }>
              {
                row.cells.map(cell => <Tile key={ cell.id } type={ cell.type } />)
              }
            </div>
          ))
        }
      </div>
    );
  }
}

export default Map;
