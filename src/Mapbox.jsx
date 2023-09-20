import React, { useState, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import GLOBALS from "./Globals"

import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY

const MapboxComponent = ({ onComplete, center, mapMarks }) => {
  const [viewState, setViewState] = useState({
    latitude: center.latitude, // Use the provided latitude or a default value
    longitude: center.longitude, // Use the provided longitude or a default value
    zoom: 7, // Use a higher zoom level if center is provided
  });

  const [marks, setMarks] = useState(mapMarks || []);
  const [currentMark, setCurrentMark] = useState(1);

  useEffect(() => {
    setViewState((prevViewState) => ({
      ...prevViewState,
      latitude: center.latitude,
      longitude: center.longitude,
    }));
  }, [center]);

  useEffect(() => {
    onComplete(marks);
  }, [marks, onComplete]);

  const handleMapClick = (event) => {
    const newMark = {
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
      markNumber: currentMark,
    };

    setMarks((prevMarks) => [...prevMarks, newMark]);
    setCurrentMark(currentMark + 1);

    onComplete(marks);
  };

  return (
    <div>

      <Map
        {...viewState}
        style={{width: 800, height: 600}}
        mapStyle="mapbox://styles/mapbox/outdoors-v12" 
        /* mapStyle="mapbox://styles/toffi/ckyn0rxbi8kj414qpssdlx2zt" */
        mapboxAccessToken={mapboxApiKey}
        onClick={handleMapClick}
        onMove={evt => setViewState(evt.viewState)}
      >
        {marks.map((mark) => (
            <Marker
              key={mark.markNumber}
              latitude={mark.latitude}
              longitude={mark.longitude}
            >
              <div className="marker">{mark.markNumber}</div>
            </Marker>
          ))}
      </Map>

    </div>
  );
};

export default MapboxComponent;
