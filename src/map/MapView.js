/*global google*/
import React, { useEffect, useRef, useState } from "react";
import { importLibrary } from "@googlemaps/js-api-loader";
import "./map.css";

const MapView = ({ coords = { lat: -15.793889, lng: -47.882778 }, zoom = 12 }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      const { Map } = await importLibrary("maps");
      const { Marker } = await importLibrary("marker");

      const mapInstance = new Map(mapRef.current, {
        center: coords,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      setMap(mapInstance);

      const markerInstance = new Marker({
        position: coords,
        map: mapInstance,
        title: "Localização inicial",
      });
      setMarker(markerInstance);
    };

    initMap().catch(err => {
      console.error('Erro ao inicializar o mapa:', err);
    });
  }, []);

  // Atualiza posição quando coords muda
  useEffect(() => {
    if (map && marker) {
      map.setCenter(coords);
      marker.setPosition(coords);
    }
  }, [coords, map, marker]);

  return <div ref={mapRef} id="map" className="map-area"></div>;
};

export default MapView;
