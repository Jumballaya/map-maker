import React, { Component } from 'react';
import Map from './Components/Map/Map';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <h2>Procedural Map Generator</h2>
        <p>
          The map is generated with pure random values and when you click the normalize button it will attempt to group the land and water together in a more natural way, based on <a href="http://www.roguebasin.com/index.php?title=Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels">the explaination here.</a>
        </p>
        <Map />
      </div>
    );
  }
}

export default App;
