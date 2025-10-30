import React, { useState } from "react";
import './converter.css';
import { UtmToDec } from './converterUtils.js';

// Converte GMS (graus, minutos, segundos) → decimal
const GmsToDecimal = (latDeg, latMin, latSec, latDir, lonDeg, lonMin, lonSec, lonDir) => {
  const lat = latDeg + latMin / 60 + latSec / 3600;
  const lon = lonDeg + lonMin / 60 + lonSec / 3600;
  return {
    lat: latDir.toUpperCase() === 'S' ? -lat : lat,
    lng: lonDir.toUpperCase() === 'O' ? -lon : lon
  };
};

const Converter = ({ setMapCoords }) => {
  const [mode, setMode] = useState('utm');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { value } = e.target;

    if (mode === 'utm') {
      setInput(value);
      setError(null);
      return;
    }

    let cleanVal = value.replace(/[^0-9NSOE]/gi, '').toUpperCase();

    if (cleanVal.length >= 2) {
      let latDeg = parseInt(cleanVal.substring(0, 2));
      if (latDeg > 90) cleanVal = '90' + cleanVal.substring(2);
    }
    if (cleanVal.length >= 4) {
      let latMin = parseInt(cleanVal.substring(2, 4));
      if (latMin > 59) cleanVal = cleanVal.substring(0, 2) + '59' + cleanVal.substring(4);
    }
    if (cleanVal.length >= 6) {
      let latSec = parseInt(cleanVal.substring(4, 6));
      if (latSec > 59) cleanVal = cleanVal.substring(0, 4) + '59' + cleanVal.substring(6);
    }
    if (cleanVal.length >= 7) {
      if (!/^[NS]$/.test(cleanVal.substring(6, 7))) {
        cleanVal = cleanVal.substring(0, 6) + cleanVal.substring(7);
      }
    }
    if (cleanVal.length >= 9) {
      let lonDeg = parseInt(cleanVal.substring(7, 9));
      if (lonDeg > 90) cleanVal = cleanVal.substring(0, 7) + '90' + cleanVal.substring(9);
    }
    if (cleanVal.length >= 11) {
      let lonMin = parseInt(cleanVal.substring(9, 11));
      if (lonMin > 59) cleanVal = cleanVal.substring(0, 9) + '59' + cleanVal.substring(11);
    }
    if (cleanVal.length >= 13) {
      let lonSec = parseInt(cleanVal.substring(11, 13));
      if (lonSec > 59) cleanVal = cleanVal.substring(0, 11) + '59' + cleanVal.substring(13);
    }
    if (cleanVal.length >= 14) {
      if (!/^[OE]$/.test(cleanVal.substring(13, 14))) {
        cleanVal = cleanVal.substring(0, 13) + cleanVal.substring(14);
      }
    }

    const chars = cleanVal.split('');
    let maskedVal = '';

    const add = (str) => maskedVal += str;
    const addSlice = (start, end) => {
      if (chars.length > start) {
        add(chars.slice(start, end).join(''));
      }
    }
    const addSep = (sep, pos) => {
      if (chars.length > pos) {
        add(sep);
      }
    }

    addSlice(0, 2); // lat deg
    addSep('° ', 2);
    addSlice(2, 4); // lat min
    addSep("' ", 4);
    addSlice(4, 6); // lat sec
    addSep('" ', 6);
    addSlice(6, 7); // lat dir
    addSep(' ', 7);
    addSlice(7, 9); // lon deg
    addSep('° ', 9);
    addSlice(9, 11); // lon min
    addSep("' ", 11);
    addSlice(11, 13); // lon sec
    addSep('" ', 13);
    addSlice(13, 14); // lon dir

    setInput(maskedVal);
    setError(null);
  };

  const handleConvert = () => {
    try {
      let coord;

      if (mode === 'utm') {
        const parts = input.split(',').map(p => p.trim());
        const [easting, northing, zone, hemisphere] = parts;
        const res = UtmToDec({
          easting: Number(easting),
          northing: Number(northing),
          zone: Number(zone),
          hemisphere
        });
        coord = { lat: res.lat, lng: res.lon };
      } else {
        const cleanedInput = input.toUpperCase().replace(/[^0-9NSOE\s'"]+/g, '');
        const parts = cleanedInput.replace(/°|'|"/g, '').split(/\s+/).filter(p => p);

        if (parts.length !== 8) {
          throw new Error("Formato GMS inválido. Use: DD° MM' SS\" D DD° MM' SS\" D (Ex: 15° 45' 30\" S 47° 55' 20\" O)");
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

        if (!/^[NS]$/i.test(latDir) || !/^[OE]$/i.test(lonDir)) {
          throw new Error('Direções inválidas. Use N/S para latitude e O/E para longitude.');
        }

        // All good: convert
        coord = GmsToDecimal(
          latD, latM, latS, latDir,
          lonD, lonM, lonS, lonDir
        );
      }

      setMapCoords(coord);
      setResult(`Lat: ${coord.lat.toFixed(6)}\nLon: ${coord.lng.toFixed(6)}`);
      setError(null);

    } catch (err) {
      setError(err.message || " Erro na conversão!");
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
            : 'Ex: 15° 46\' 48" S 47° 55\' 45" O'}
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