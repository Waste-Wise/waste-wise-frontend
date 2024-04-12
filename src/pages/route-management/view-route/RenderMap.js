import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types' // Import PropTypes for prop type validation

const RenderMap = ({ selectedWayPoints, loaded }) => {
  //

  useEffect(() => {
    if (window.google && selectedWayPoints.length > 0) {
      const directionsService = new window.google.maps.DirectionsService()
      const directionsRenderer = new window.google.maps.DirectionsRenderer()

      const mapOptions = {
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        scaleControl: true,
        rotateControl: true,
        gestureHandling: 'greedy',
        disableDefaultUI: true
      }

      const mapInstance = new window.google.maps.Map(document.getElementById('map'), mapOptions)

      directionsRenderer.setMap(mapInstance)

      const filteredWayPoints = selectedWayPoints.filter(wayPoint => wayPoint !== '')

      const wayPoints = filteredWayPoints.slice(1, -1).map(wayPoint => ({
        location: wayPoint.description,
        stopover: true
      }))

      const request = {
        origin: filteredWayPoints[0]?.description,
        destination: filteredWayPoints[filteredWayPoints.length - 1]?.description,
        waypoints: wayPoints,
        travelMode: 'DRIVING'
      }

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result)
        }
      })
    }
  }, [selectedWayPoints, loaded])

  return <div id='map' style={{ width: '100%', height: '300px' }}></div>
}

// Prop type validation for selectedWayPoints
RenderMap.propTypes = {
  selectedWayPoints: PropTypes.array.isRequired,
  loaded: PropTypes.bool.isRequired
}

export default RenderMap
