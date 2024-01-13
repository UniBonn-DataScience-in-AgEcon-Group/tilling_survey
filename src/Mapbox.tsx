import React, { useState, useEffect } from "react";
import Map, { Marker, Source, Layer } from 'react-map-gl';
import type {FillLayer} from "react-map-gl";
import type {FeatureCollection} from "geojson";

import GeocoderControl from "./geocoder-control";

import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY

// TODO: Add onComplete function so chosen polygons are added to responses

const MapboxComponent = ({ onComplete, center, mapMarks, setCenter = false }) => {
  const [viewState, setViewState] = useState({
    latitude: center[1],
    longitude: center[0],
    zoom: 7,
  });

  const [clickedPolygons, setClickedPolygons] = useState(mapMarks);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/outdoors-v12");

  /*useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });*/

  useEffect(() => {
    onComplete(clickedPolygons);
  }, [clickedPolygons, onComplete]);

  // useEffect because useState is asynchronous and didn't
  // center the viewport of the map correctly
  useEffect(() => {
    if (setCenter) {
    setViewState((prevViewState) => ({
      ...prevViewState,
      latitude: center[1],
      longitude: center[0],
    }));
    }
  }, [center]);

  const toggleMapStyle = () => {
    setMapStyle(currentStyle => 
      currentStyle === "mapbox://styles/mapbox/outdoors-v12"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/outdoors-v12"
    );
  };

  const handlePolygonClick = (event) => {
    const features = event.features;

    if (features && features.length > 0) {
      const clickedPolygon = features[0];

      const geojson = clickedPolygon._vectorTileFeature.toGeoJSON();
      // For some reason, toGeoJSON jumbles coords, so add manually
      geojson.geometry.coordinates = clickedPolygon.geometry.coordinates;

      const currentPolygonId = clickedPolygon.properties.poly_id;

      setClickedPolygons((prevPolygons) => {
        const existingIndex = prevPolygons.features.findIndex(
          (feature) => feature.properties.poly_id === currentPolygonId
        );

        if (existingIndex !== -1) {
          // If the polygon with the same id exists, remove it
          const updatedFeatures = [...prevPolygons.features];
          updatedFeatures.splice(existingIndex, 1);

          return {
            ...prevPolygons,
            features: updatedFeatures,
          };
        } else {
          // If the polygon with the same id doesn't exist, add it
          return {
            ...prevPolygons,
            features: [...prevPolygons.features, geojson],
          };
        }
      });
    }
    onComplete(clickedPolygons);
};

  const fieldLayerStyle: FillLayer = {
    id: 'plot-polygons',
    type: 'fill',
    source: "plot-shapes",
    "source-layer": "plots_germany",
    paint: {
      "fill-outline-color": "#007cbf",
      "fill-color": "#007cbf",
      "fill-opacity": 0.5
    }
  };

  const clickedPolygonsLayerStyle: FillLayer = {
    id: 'clicked-polygons',
    type: 'fill',
    source: "clicked-polygons-source",
    paint: {
      "fill-outline-color": "#ffffff",
      "fill-color": "#ff0000",
      "fill-opacity": 0.8
    }
  };

  return (
    <div style={{position: "relative"}}>

      <Map
        {...viewState}
        style={{width: 800, height: 600}}
        mapStyle={mapStyle}
        /* mapStyle="mapbox://styles/toffi/ckyn0rxbi8kj414qpssdlx2zt" */
        mapboxAccessToken={mapboxApiKey}
        onClick={handlePolygonClick}
        onMove={event => setViewState(event.viewState)}
        interactiveLayerIds = {["plot-polygons"]}
      >
        <GeocoderControl mapboxAccessToken={mapboxApiKey} position="top-right" />
        <Source id="plot-shapes" type="vector" url={"mapbox://gotetteh.plots-germany-tiles"}>
          <Layer {...fieldLayerStyle}/>
        </Source>

        <Source id="clicked-polygons-source" type="geojson" data={clickedPolygons}>
          <Layer {...clickedPolygonsLayerStyle} />
        </Source>

      </Map>
      <button onClick={toggleMapStyle} style={{ position: 'absolute', top: 2, left: 2, zIndex: 1 }}>
        Kartentyp wechseln
      </button>
    </div>
  );
};

export default MapboxComponent;
