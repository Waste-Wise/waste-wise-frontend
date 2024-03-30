import React, { useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Alert,
  AlertTitle,
  CircularProgress
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Icon } from '@iconify/react'

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 30,
  height: 30,
  border: `2px solid ${theme.palette.background.paper}`
}))

const libraries = ['places']

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const mapStyles = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5'
      }
    ]
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161'
      }
    ]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5'
      }
    ]
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd'
      }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee'
      }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e'
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff'
      }
    ]
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161'
      }
    ]
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e'
      }
    ]
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5'
      }
    ]
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee'
      }
    ]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9'
      }
    ]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e'
      }
    ]
  }
]

const center = {
  lat: 7.925, // default latitude
  lng: 80.65 // default longitude
}

const markerData = [
  {
    vehicle: 'KA-01-1234',
    driver: 'John Doe',
    location: 'Colombo',
    lat: 6.9271,
    lng: 79.8612
  },
  {
    vehicle: 'KA-01-1235',
    driver: 'Jane Doe',
    location: 'Kandy',
    lat: 7.2906,
    lng: 80.6337
  },
  {
    vehicle: 'KA-01-1236',
    driver: 'John Doe',
    location: 'Galle',
    lat: 6.0329,
    lng: 80.2168
  },
  {
    vehicle: 'KA-01-1237',
    driver: 'Jane Doe',
    location: 'Jaffna',
    lat: 9.6615,
    lng: 80.0255
  }
]

const TrackFleet = () => {
  const [map, setMap] = useState(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBEufS_TQGxDOSonHDsylhODFHcTzntVuY',
    libraries
  })

  const [viewport, setViewport] = useState({
    latitude: center.lat,
    longitude: center.lng,
    zoom: 7.5
  })

  if (loadError) {
    return (
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        There was an error loading the maps!
      </Alert>
    )
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '75vh',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <CircularProgress size={60} />
        <Typography variant='h6' sx={{ mt: 2 }}>
          Loading Maps...
        </Typography>
      </Box>
    )
  }

  const handleViewportChange = viewport => {
    setViewport(viewport)
  }

  return (
    <Card>
      <CardContent
        sx={{
          padding: 0,
          '&:last-child': {
            paddingBottom: 0
          }
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 170px)',
              py: 5
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mx: 5,
                mb: 3
              }}
            >
              <Box>
                <Typography variant='h6'>Fleet Tracking</Typography>
                <Typography variant='caption'>Last updated: 10 minutes ago</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}
              >
                <IconButton>
                  <Icon icon='material-symbols:refresh' width={25} height={25} />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                overflowY: 'auto',
                padding: 3,
                mx: 2,
                scrollbarWidth: 'thin'
              }}
            >
              {markerData.map((marker, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 5,
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: 'background.default'
                    }
                  }}
                  onClick={() => {
                    handleViewportChange({
                      latitude: marker.lat,
                      longitude: marker.lng,
                      zoom: 20
                    })
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1.35
                    }}
                  >
                    <Badge
                      overlap='circular'
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={<SmallAvatar src='/images/avatars/1.png' />}
                    >
                      <Avatar sx={{ width: 60, height: 60 }}>
                        <Icon icon='bi:truck' width={30} height={30} />
                      </Avatar>
                    </Badge>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 3
                    }}
                  >
                    <Typography variant='body1'>{marker.vehicle}</Typography>
                    <Typography variant='body2'>Driver: {marker.driver}</Typography>
                    <Typography variant='body2'>Location: {marker.location}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100%'
            }}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              onLoad={map => {
                setMap(map)
              }}
              options={{
                styles: mapStyles,

                // disableDefaultUI: true
                panControl: false,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                overviewMapControl: false,
                rotateControl: false
              }}
              center={{ lat: viewport.latitude, lng: viewport.longitude }}
              zoom={viewport.zoom}
              onZoomChanged={() => {
                setViewport({
                  zoom: map?.getZoom() || viewport.zoom
                })
              }}
            >
              {markerData.map((marker, index) => (
                <Marker
                  key={index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={{
                    url: '/images/misc/fleet-truck-1.png',
                    scaledSize: new window.google.maps.Size(Number(viewport.zoom) * 5, Number(viewport.zoom) * 5)
                  }}
                />
              ))}
            </GoogleMap>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TrackFleet
