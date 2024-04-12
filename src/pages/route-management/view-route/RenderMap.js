import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types' // Import PropTypes for prop type validation

const GoogleMapsAPIKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const MAP_SCRIPT_ID = 'google-maps-script' // ID for the script element

const RenderMap = ({ selectedWayPoints }) => {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const loadMapsScript = () => {
      if (!mapLoaded && !document.getElementById(MAP_SCRIPT_ID)) {
        const script = document.createElement('script')
        script.id = MAP_SCRIPT_ID
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPIKey}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => setMapLoaded(true)
        document.head.appendChild(script)
      }
    }

    loadMapsScript()
  }, [mapLoaded])

  useEffect(() => {
    if (mapLoaded && selectedWayPoints.length > 0) {
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
  }, [selectedWayPoints, mapLoaded])

  return <div id='map' style={{ width: '100%', height: '300px' }}></div>
}

// Prop type validation for selectedWayPoints
RenderMap.propTypes = {
  selectedWayPoints: PropTypes.array.isRequired
}

export default RenderMap
