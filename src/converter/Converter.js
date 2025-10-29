import React, { useState } from "react";
import './converter.css';
import { UtmToDec } from './converterUtils.js';

// Converte GMS (graus, minutos, segundos) → decimal
const GmsToDecimal = (latDeg, latMin, latSec, latDir, lonDeg, lonMin, lonSec, lonDir) => {
  const lat = latDeg + latMin / 60 + latSec / 3600;
  const lon = lonDeg + lonMin / 60 + lonSec / 3600;
  return {
    lat: latDir.toUpperCase() === 'S' ? -lat : lat,
    lng: lonDir.toUpperCase() === 'W' ? -lon : lon
  };
};

const Converter = ({ setMapCoords }) => {
  const [mode, setMode] = useState('utm');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { value } = e.target;
    const cleanVal = value.toUpperCase().replace(/[^0-9NSWE]/g, '');

    const lengths = mode === 'utm' ? [6, 7, 2, 1] : [2, 2, 2, 1, 2, 2, 2, 1];
    const parts = [];
    let currentPos = 0;

    for (const len of lengths) {
      if (currentPos >= cleanVal.length) break;
      parts.push(cleanVal.substr(currentPos, len));
      currentPos += len;
    }

    setInput(parts.join(','));
    setError(null);
  };

  const handleConvert = () => {
    const parts = input.split(',').map(p => p.trim());

    try {
      let coord;

      if (mode === 'utm') {

        const [easting, northing, zone, hemisphere] = parts;
        const res = UtmToDec({
          easting: Number(easting),
          northing: Number(northing),
          zone: Number(zone),
          hemisphere
        });
        coord = { lat: res.lat, lng: res.lon };
      } else {

        // Validate number of parts for GMS input
        if (parts.length !== 8) {
          throw new Error("Formato GMS inválido. Use: latDeg,latMin,latSec,latDir,lonDeg,lonMin,lonSec,lonDir (Ex: 15,45,30,S,47,55,20,W)");
        }

        const [latDeg, latMin, latSec, latDir, lonDeg, lonMin, lonSec, lonDir] = parts;

        // Basic validation for numeric ranges
        const latD = Number(latDeg);
        const latM = Number(latMin);
        const latS = Number(latSec);
        const lonD = Number(lonDeg);
        const lonM = Number(lonMin);
        const lonS = Number(lonSec);

        if (
          Number.isNaN(latD) || Number.isNaN(latM) || Number.isNaN(latS) ||
          Number.isNaN(lonD) || Number.isNaN(lonM) || Number.isNaN(lonS)
        ) {
          throw new Error('Valores numéricos inválidos em GMS. Certifique-se de usar apenas números para graus/minutos/segundos.');
        }

        if (latD < 0 || latD > 90 || lonD < 0 || lonD > 180) {
          throw new Error('Graus fora do intervalo. Latitude: 0–90, Longitude: 0–180.');
        }
        if (latM < 0 || latM >= 60 || lonM < 0 || lonM >= 60 || latS < 0 || latS >= 60 || lonS < 0 || lonS >= 60) {
          throw new Error('Minutos/segundos devem estar no intervalo 0–59.');
        }

        if (!/^[NS]$/i.test(latDir) || !/^[EW]$/i.test(lonDir)) {
          throw new Error('Direções inválidas. Use N/S para latitude e E/W para longitude.');
        }

        // All good: convert
        coord = GmsToDecimal(
          latD, latM, latS, latDir,
          lonD, lonM, lonS, lonDir
        );
      }

      setMapCoords(coord);
      setResult(`Lat: ${coord.lat.toFixed(6)}
Lon: ${coord.lng.toFixed(6)}`);
      setError(null);

    } catch {
      setError(" Erro na conversão!");
      setResult(null);
    }
  };

  return (
    <div id="converter">

      <div id="btn-container">
        <button onClick={() => { setMode('utm'); setInput(''); setResult(null); setError(null); }}>UTM → Decimal</button>
        <button onClick={() => { setMode('gms'); setInput(''); setResult(null); setError(null); }}>GMS → Decimal</button>
      </div>

      <div id="input-container">
        <input
          placeholder={mode === 'utm'
            ? 'Ex: 500000,8250000,23,S'
            : 'Ex: 15,45,30,S,47,55,20,W'}
          value={input}
          onChange={handleChange}
          className="masked-input"
        />
        <button onClick={handleConvert}>Converter</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {result && <pre id="output">{result}</pre>}
    </div>
  );
};

export default Converter;