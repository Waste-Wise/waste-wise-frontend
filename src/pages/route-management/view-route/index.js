import { Icon } from '@iconify/react'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, TextField, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import { debounce } from '@mui/material/utils'
import parse from 'autosuggest-highlight/parse'
import { useEffect, useMemo, useRef, useState } from 'react'

import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'

import MuiTimeline from '@mui/lab/Timeline'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { toast } from 'react-hot-toast'
import CustomChip from 'src/@core/components/mui/chip'

import { useRouter } from 'next/router'

import rows from '../../../@fake-db/mock-data/view-routes'

const GoogleMapsAPIKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

function loadScript(src, position, id) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const autocompleteService = { current: null }

const ViewRoute = () => {
  const router = useRouter()
  const [inputValueEdit, setInputValueEdit] = useState('')
  const [optionsEdit, setOptionsEdit] = useState([])

  const [routeName, setRouteName] = useState('')
  const [routeNameError, setRouteNameError] = useState('')
  const [routeStart, setRouteStart] = useState('')
  const [routeStartError, setRouteStartError] = useState('')
  const [routeEnd, setRouteEnd] = useState('')
  const [routeEndError, setRouteEndError] = useState('')
  const [routeDistance, setRouteDistance] = useState('')
  const [routeDistanceError, setRouteDistanceError] = useState('')
  const [routeDuration, setRouteDuration] = useState('')
  const [routeDurationError, setRouteDurationError] = useState('')

  const [selectedWayPoints, setSelectedWayPoints] = useState([''])

  const loaded = useRef(false)

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPIKey}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      )
    }

    loaded.current = true
  }

  const fetch = useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(
          {
            ...request,
            componentRestrictions: { country: 'LK' }
          },
          callback
        )
      }, 400),
    []
  )

  useEffect(() => {
    let active = true

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
    }
    if (!autocompleteService.current) {
      return undefined
    }

    if (inputValueEdit === '') {
      setOptionsEdit(inputValueEdit ? [] : [])

      return undefined
    }

    fetch({ input: inputValueEdit }, results => {
      if (active) {
        let newOptions = []

        if (inputValueEdit) {
          newOptions = [inputValueEdit]
        }

        if (results) {
          newOptions = [...results]
        }

        setOptionsEdit(newOptions)
      }
    })

    return () => {
      active = false
    }
  }, [inputValueEdit, fetch])

  const handleAddWayPoint = () => {
    //check if last waypoint is empty
    if (selectedWayPoints.length > 0 && selectedWayPoints[selectedWayPoints.length - 1] === '') {
      //create 5minute toast
      toast.error('Please fill the last waypoint before adding a new one')
    } else {
      setSelectedWayPoints(prevWayPoints => [...prevWayPoints, ''])
      setInputValueEdit('')
    }
  }

  const handleRemoveWayPoint = indexToRemove => {
    setSelectedWayPoints(prevWayPoints => prevWayPoints.filter((wayPoint, index) => index !== indexToRemove))
  }

  const handleDragEnd = result => {
    if (!result.destination) return

    const reorderedWayPoints = Array.from(selectedWayPoints)
    const [reorderedItem] = reorderedWayPoints.splice(result.source.index, 1)
    reorderedWayPoints.splice(result.destination.index, 0, reorderedItem)

    setSelectedWayPoints(reorderedWayPoints)
  }

  useEffect(() => {
    const loadMapsScript = () => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPIKey}&libraries=places&callback=initMap`
      script.defer = true
      document.head.appendChild(script)
    }

    window.initMap = () => {}

    window.initDistanceMatrix = () => {}

    if (!window.google) {
      loadMapsScript()
    } else {
      window.initMap()
      window.initDistanceMatrix()
    }
  }, [])

  const calculateDistanceAndDuration = async (origin, destination) => {
    const service = new window.google.maps.DistanceMatrixService()
    let distance = 0
    let duration = 0
    await service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING'
      },
      (response, status) => {
        console.log(response)
        if (status === 'OK') {
          // Assuming only one result is returned
          const result = response.rows[0].elements[0]
          distance = result.distance.value / 1000
          duration = result.duration.value / 3600
        } else {
          console.error('Error fetching distance:', status)
        }
      }
    )

    return { distance, duration }
  }

  const calculateTotalDistanceAndDuration = async () => {
    let totalDistance = 0
    let totalDuration = 0
    for (let i = 0; i < selectedWayPoints.length - 1; i++) {
      const origin = selectedWayPoints[i].description
      const destination = selectedWayPoints[i + 1].description
      const { distance, duration } = await calculateDistanceAndDuration(origin, destination)

      totalDistance += distance
      totalDuration += duration
    }

    setRouteDistance(Number(totalDistance).toFixed(2))
    setRouteDuration(Number(totalDuration).toFixed(2))
  }

  useEffect(() => {
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

    const wayPoints = selectedWayPoints.slice(1, -1).map(wayPoint => ({
      location: wayPoint.description,
      stopover: true
    }))

    const request = {
      origin: selectedWayPoints[0].description,
      destination: selectedWayPoints[selectedWayPoints.length - 1].description,
      waypoints: wayPoints,
      travelMode: 'DRIVING'
    }

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
      }
    })
  }, [selectedWayPoints])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Manage Routes</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              action={
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpenDialog(true)
                  }}
                >
                  <Icon icon='mdi:plus' fontSize={20} />
                  Add Route
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6} sx={{ my: 5 }}>
                  <TextField
                    id='outlined-basic'
                    label='Route Name'
                    variant='outlined'
                    fullWidth
                    size='small'
                    value={routeName}
                    onChange={e => {
                      setRouteNameError('')
                      setRouteName(e.target.value)
                    }}
                    error={routeNameError.length > 0}
                    helperText={routeNameError}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    paddingTop: '0 !important',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    maxHeight: 'calc(100vh - 290px)',
                    overflowY: 'auto'
                  }}
                >
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Timeline
                      sx={{
                        m: 0,
                        p: 0
                      }}
                    >
                      <Droppable droppableId='wayPoints'>
                        {provided => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {selectedWayPoints.map((wayPoint, index) => (
                              <Draggable key={index} draggableId={`wayPoint-${index}`} index={index}>
                                {provided => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TimelineItem>
                                      <TimelineSeparator>
                                        <TimelineDot
                                          color={
                                            index === 0
                                              ? 'success'
                                              : index === selectedWayPoints.length - 1
                                              ? 'error'
                                              : 'grey'
                                          }
                                        >
                                          <Icon icon='mdi:map-marker' />
                                        </TimelineDot>
                                        {index !== selectedWayPoints.length - 1 && <TimelineConnector />}
                                      </TimelineSeparator>
                                      <TimelineContent sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            gap: 3
                                          }}
                                        >
                                          <Autocomplete
                                            fullWidth
                                            size='small'
                                            id={`google-map-demo-edit-${index}`}
                                            getOptionLabel={option =>
                                              typeof option === 'string' ? option : option.description
                                            }
                                            filterOptions={x => x}
                                            options={optionsEdit}
                                            value={wayPoint}
                                            noOptionsText='No locations'
                                            onChange={(event, newValue) => {
                                              setOptionsEdit(newValue ? [newValue, ...optionsEdit] : optionsEdit)
                                              setSelectedWayPoints(prevWayPoints =>
                                                prevWayPoints.map((prevWayPoint, prevIndex) =>
                                                  prevIndex === index ? newValue : prevWayPoint
                                                )
                                              )
                                            }}
                                            onFocus={() => {
                                              setInputValueEdit(wayPoint?.description ? wayPoint.description : '')
                                            }}
                                            onInputChange={(event, newInputValue) => {
                                              setInputValueEdit(newInputValue)
                                            }}
                                            renderInput={params => <TextField {...params} fullWidth />}
                                            renderOption={(props, option) => {
                                              const matches =
                                                option.structured_formatting?.main_text_matched_substrings || []

                                              const parts = parse(
                                                option.structured_formatting?.main_text,
                                                matches.map(match => [match.offset, match.offset + match.length])
                                              )

                                              return (
                                                <li {...props}>
                                                  <Grid container alignItems='center'>
                                                    <Grid item sx={{ display: 'flex', width: 44 }}>
                                                      <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                                    </Grid>
                                                    <Grid
                                                      item
                                                      sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}
                                                    >
                                                      {parts.map((part, index) => (
                                                        <Box
                                                          key={index}
                                                          component='span'
                                                          sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                                        >
                                                          {part.text}
                                                        </Box>
                                                      ))}
                                                      <Typography variant='body2' color='text.secondary'>
                                                        {option.structured_formatting?.secondary_text}
                                                      </Typography>
                                                    </Grid>
                                                  </Grid>
                                                </li>
                                              )
                                            }}
                                          />

                                          <IconButton
                                            size='small'
                                            onClick={() => handleRemoveWayPoint(index)}
                                            sx={{ marginLeft: 'auto' }}
                                          >
                                            <Icon icon='mdi:close' />
                                          </IconButton>
                                        </Box>
                                      </TimelineContent>
                                    </TimelineItem>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </Timeline>
                  </DragDropContext>
                </Grid>
              </Grid>

              <>
                <div id='map' style={{ width: '100%', height: '47.5%' }}></div>
                <Grid container spacing={6} sx={{ pt: 8, overflow: 'auto' }}>
                  <Grid item xs={12}>
                    <TextField
                      id='outlined-basic'
                      label='Route Name'
                      variant='outlined'
                      fullWidth
                      value={routeName}
                      onChange={e => {
                        setRouteNameError('')
                        setRouteName(e.target.value)
                      }}
                      disabled
                      size='small'
                      error={routeNameError.length > 0}
                      helperText={routeNameError}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id='outlined-basic'
                      label='Route Start'
                      variant='outlined'
                      fullWidth
                      value={routeStart}
                      onChange={e => {
                        setRouteStartError('')
                        setRouteStart(e.target.value)
                      }}
                      disabled
                      size='small'
                      error={routeStartError.length > 0}
                      helperText={routeStartError}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id='outlined-basic'
                      label='Route End'
                      variant='outlined'
                      fullWidth
                      value={routeEnd}
                      onChange={e => {
                        setRouteEndError('')
                        setRouteEnd(e.target.value)
                      }}
                      disabled
                      size='small'
                      error={routeEndError.length > 0}
                      helperText={routeEndError}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id='outlined-basic'
                      label='Distance'
                      type='number'
                      variant='outlined'
                      fullWidth
                      value={routeDistance}
                      onChange={e => {
                        setRouteDistanceError('')
                        setRouteDistance(e.target.value)
                      }}
                      disabled
                      size='small'
                      error={routeDistanceError.length > 0}
                      helperText={routeDistanceError}
                      InputProps={{
                        endAdornment: 'KM'
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id='outlined-basic'
                      label='Duration'
                      type='number'
                      variant='outlined'
                      fullWidth
                      value={routeDuration}
                      onChange={e => {
                        setRouteDurationError('')
                        setRouteDuration(e.target.value)
                      }}
                      disabled
                      size='small'
                      error={routeDurationError.length > 0}
                      helperText={routeDurationError}
                      InputProps={{
                        endAdornment: 'Hours'
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default ViewRoute
