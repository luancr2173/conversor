import { useState } from 'react';
import './App.css';
import MapView from './map/MapView';
import SpeedDialConverter from './converter/SpeedDial.js';

function App() {
  const [coords, setCoords] = useState({ lat: -15.793889, lng: -47.882778 });

  return (
    <div className="App">
      <MapView coords={coords} />
      <SpeedDialConverter setCoords={setCoords} />
    </div>
  );
}

export default App;