import * as React from 'react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const TrackFleet = () => {
  return (
    <Map
      mapboxAccessToken='pk.eyJ1Ijoic2FuZHVwYSIsImEiOiJjbHUyOXd1Y2wwaTB0MmpwZHppcml6YXF1In0.jaO4pQLdFCLh1JU1SM_WyQ'
      initialViewState={{
        longitude: 79.9731,
        latitude: 6.9111,
        zoom: 14.5
      }}
      mapStyle='mapbox://styles/mapbox/light-v9'
    >
      <Marker longitude={79.974} latitude={6.9145}>
        <img
          src='/images/misc/fleet-truck-1.png'
          alt='Fleet Truck'
          style={{
            width: 'auto',
            height: '50px'
          }}
        />
      </Marker>
      <Marker longitude={80} latitude={6.94}>
        <img
          src='/images/misc/fleet-truck-1.png'
          alt='Fleet Truck'
          style={{
            width: 'auto',
            height: '50px'
          }}
        />
      </Marker>
    </Map>
  )
}

export default TrackFleet
