import React from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';

import ZoomIn from '../assets/add.svg?react';
import ZoomOut from '../assets/negative.svg?react';
import Center from '../assets/reticle.svg?react';
import iconMapping from '../assets/location-icon-mapping.json'
import iconAtlas from '../assets/location-icon-atlas.png'
import { renderContextMenu } from './ContextMenu';
import IconClusterLayer from './IconClusterLayer';
import { renderTooltip } from './Tooltip';

const MAP_VIEW = new MapView({ repeat: true });
const INITIAL_VIEW_STATE = {
  latitude: 37,
  longitude: -95.7,
  zoom: 1.8,
  minZoom: 0,
  maxZoom: 20,
  pitch: 0,
  bearing: 0
};
const ZOOM_STEP = 0.5;
const DEFAULT_SIZE_SCALE = 40;

const MAP_STYLE = 'mapbox://styles/mapbox/light-v1';


const MAPBOX_TOKEN =
  'pk.eyJ1IjoiamZyYW50eSIsImEiOiJjam91bzF2YWUxZTFzM3FydnBncWs3dnoyIn0.cXRBg3Vcetu9d-gjstnGig';


function getFeatures() {
  return {
    mapboxStyle: MAP_STYLE,
    mapboxToken: MAPBOX_TOKEN,
  };
}

function Map(props) {
  const { data, sizeScale } = props;
  const [viewState, setViewState] = React.useState({...INITIAL_VIEW_STATE});
  const [hoverInfo, setHoverInfo] = React.useState(null);
  const [contextMenuInfo, setContextMenuInfo] = React.useState(null);

  const hideTooltip = () => {
    setHoverInfo(null);
    setContextMenuInfo(null);
  };

  const handleClick = (info, event) => {
    if (event.rightButton) {
      setHoverInfo(null);
      setContextMenuInfo(info.picked ? info : null);
    } else {
      setContextMenuInfo(null);
      setHoverInfo(info.picked ? info : null);
    }
  };

  const adjustZoom = (delta) => {
    setViewState(viewState => {
      return {
        ...viewState,
        zoom: Math.max(
          viewState.minZoom,
          Math.min(viewState.maxZoom, viewState.zoom + delta),
        ),
      }
    });
  }

  const layer = new IconClusterLayer({
    id: 'icon-cluster',
    data,
    pickable: true,
    getPosition: d => d.coordinates,
    iconAtlas,
    iconMapping,
    onHover: contextMenuInfo == null &&
              !hoverInfo?.objects && // when click to expand tooltip
              setHoverInfo,
    sizeScale: sizeScale ?? DEFAULT_SIZE_SCALE,
    sizeMinPixels: 1,
    sizeMaxPixels: 100,
  })
  const features = getFeatures();

  return (
    <div onContextMenu={e => {
      e.preventDefault();
      e.stopPropagation();
    }}>
      <DeckGL
        layers={[layer]}
        views={MAP_VIEW}
        viewState={viewState}
        controller={{ dragRotate: false }}
        onViewStateChange={({ viewState }) => {
          setViewState(viewState);
          hideTooltip();
        }}
        onClick={handleClick}
      >
        <StaticMap
          key={features.mapboxToken}
          reuseMaps
          mapboxApiAccessToken={features.mapboxToken}
          // mapStyle={features.mapboxStyle}
          preventStyleDiffing
        />
        {renderTooltip(hoverInfo)}
        {renderContextMenu(contextMenuInfo)}
      </DeckGL>
      {/* icons */}
      <section className="iconsSection">
        <div className="icons">
          <button title="Center data" onClick={() => setViewState({ ...INITIAL_VIEW_STATE })}>
            <Center />
          </button>
        </div>
        <div className="icons" style={{ marginTop: '8px' }}>
          <button title="Zoom in" onClick={() => adjustZoom(ZOOM_STEP)}>
            <ZoomIn />
          </button>
          <div className="divider"></div>
          <button title="Zoom out" onClick={() => adjustZoom(-1 * ZOOM_STEP)}>
            <ZoomOut />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Map;