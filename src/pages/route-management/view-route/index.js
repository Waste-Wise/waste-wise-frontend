import { Icon } from '@iconify/react'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import { debounce } from '@mui/material/utils'
import parse from 'autosuggest-highlight/parse'
import { useCallback, useEffect, useState } from 'react'

import MuiTimeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { toast } from 'react-hot-toast'

import { useRouter } from 'next/router'

import { rows } from '../../../@fake-db/mock-data/view-routes'
import RenderMap from './RenderMap'

const GoogleMapsAPIKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const MAP_SCRIPT_ID = 'google-maps-script' // ID for the script element
let mapLoaded = false

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

const ViewRoute = () => {
  const router = useRouter()

  const viewRouteId = router.query.id
  const viewType = router.query.viewType
  const [inputValueEdit, setInputValueEdit] = useState('')
  const [optionsEdit, setOptionsEdit] = useState([])

  const [routeName, setRouteName] = useState('')
  const [routeStart, setRouteStart] = useState('')
  const [routeEnd, setRouteEnd] = useState('')
  const [routeDistance, setRouteDistance] = useState('')
  const [routeDuration, setRouteDuration] = useState('')

  const [routeNameError, setRouteNameError] = useState('')
  const [routeStartError, setRouteStartError] = useState('')
  const [routeEndError, setRouteEndError] = useState('')
  const [routeDistanceError, setRouteDistanceError] = useState('')
  const [routeDurationError, setRouteDurationError] = useState('')

  const [selectedWayPoints, setSelectedWayPoints] = useState([''])

  const [disableRouteDelete, setDisableRouteDelete] = useState(true)

  const fetch = useCallback(
    debounce((request, callback) => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const autocompleteService = new window.google.maps.places.AutocompleteService()
        autocompleteService.getPlacePredictions(
          {
            ...request,
            componentRestrictions: { country: 'LK' }
          },
          callback
        )
      }
    }, 400),
    []
  )

  useEffect(() => {
    console.log('useEffectCalled')
    let active = true

    if (inputValueEdit === '') {
      setOptionsEdit([])

      return () => {} // Return an empty cleanup function
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
    if (selectedWayPoints.length > 0 && selectedWayPoints[selectedWayPoints.length - 1] === '') {
      toast.error('Please fill the last waypoint before adding a new one')
    } else {
      setSelectedWayPoints(prevWayPoints => [...prevWayPoints, ''])
      setInputValueEdit('')
    }
  }

  const handleRemoveWayPoint = indexToRemove => {
    setSelectedWayPoints(prevWayPoints => prevWayPoints.filter((_, index) => index !== indexToRemove))
  }

  const handleDragEnd = result => {
    if (!result.destination) return

    const reorderedWayPoints = Array.from(selectedWayPoints)
    const [reorderedItem] = reorderedWayPoints.splice(result.source.index, 1)
    reorderedWayPoints.splice(result.destination.index, 0, reorderedItem)

    setSelectedWayPoints(reorderedWayPoints)
  }

  const calculateDistanceAndDuration = async (origin, destination) => {
    if (window.google && window.google.maps) {
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
          if (status === 'OK') {
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
  }

  const calculateTotalDistanceAndDuration = async () => {
    if (window.google && window.google.maps) {
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
  }

  useEffect(() => {
    if (selectedWayPoints.length > 1) {
      calculateTotalDistanceAndDuration()
      setRouteStart(selectedWayPoints[0]?.description)
      setRouteEnd(selectedWayPoints[selectedWayPoints.length - 1]?.description)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWayPoints])

  useEffect(() => {
    setSelectedWayPoints(rows[0]?.route_stops || [])
    setRouteName(rows[0]?.route_name || '')
    setRouteStart(rows[0]?.route_start || '')
    setRouteEnd(rows[0]?.route_end || '')
    setRouteDistance(rows[0]?.route_distance || '')
    setRouteDuration(rows[0]?.route_duration || '')
  }, [])

  useEffect(() => {
    if (!mapLoaded && typeof window !== 'undefined' && !document.getElementById(MAP_SCRIPT_ID)) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPIKey}&libraries=places`,
        document.querySelector('head'),
        MAP_SCRIPT_ID
      )
      mapLoaded = true
    }
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h5'>View Route - #{viewRouteId}</Typography>
          {viewType === 'view' && (
            <Button
              onClick={() => {
                router.push(`/route-management/view-route?id=${viewRouteId}&viewType=edit`)
              }}
              variant='outlined'
            >
              <Icon icon='mdi:pencil' />
              &ensp; Edit Route
            </Button>
          )}

          {viewType === 'edit' && (
            <Button
              onClick={() => {
                router.push(`/route-management/view-route?id=${viewRouteId}&viewType=view`)
              }}
              variant='outlined'
            >
              <Icon icon='mdi:eye' />
              &ensp; View Route
            </Button>
          )}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={6}>
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
                  disabled={viewType === 'view'}
                  size='small'
                  error={routeNameError.length > 0}
                  helperText={routeNameError}
                />
              </Grid>

              <Grid item xs={2}>
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
              <Grid item xs={2}>
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
              <Grid
                item
                xs={2}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                <Chip
                  label='Active'
                  color='success'
                  sx={{
                    px: 5
                  }}
                />
              </Grid>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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

              <Grid item xs={12}>
                <RenderMap selectedWayPoints={selectedWayPoints} loaded={mapLoaded} />
              </Grid>
              {viewType === 'edit' && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}
                >
                  <Button
                    onClick={handleAddWayPoint}
                    variant='outlined'
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Icon icon='mdi:plus' />
                    &ensp; Add Route Stop
                  </Button>
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  maxHeight: 'calc(100vh - 300px)',
                  overflowY: 'auto',
                  mt: viewType === 'edit' ? 2 : 8
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
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                                        {viewType === 'edit' && (
                                          <>
                                            <Autocomplete
                                              fullWidth
                                              size='small'
                                              id={`google-map-demo-edit-${index}`}
                                              getOptionLabel={option =>
                                                typeof option === 'string' ? option : option.description
                                              }
                                              isOptionEqualToValue={(option, value) =>
                                                option.description === value.description
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

                                            {selectedWayPoints.length > 2 && (
                                              <IconButton
                                                size='small'
                                                onClick={() => handleRemoveWayPoint(index)}
                                                sx={{ marginLeft: 'auto' }}
                                              >
                                                <Icon icon='mdi:close' />
                                              </IconButton>
                                            )}
                                          </>
                                        )}
                                        {viewType === 'view' && (
                                          <Typography
                                            variant='body1'
                                            sx={{
                                              mt: 1.5
                                            }}
                                          >
                                            {wayPoint.description}
                                          </Typography>
                                        )}
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
              {viewType === 'edit' && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}
                >
                  <Button variant='contained' color='primary'>
                    Save Changes
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {viewType === 'edit' && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
                      <Typography variant='h6'>Delete Route</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity='error'>
                        <AlertTitle>Delete Route</AlertTitle>
                        Are you sure you want to delete this route? This action cannot be undone.
                      </Alert>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        id='outlined-basic'
                        label='Enter Route Name'
                        variant='outlined'
                        color='error'
                        fullWidth
                        size='small'
                        onChange={e => {
                          if (e.target.value !== routeName) {
                            setDisableRouteDelete(true)
                          } else {
                            setDisableRouteDelete(false)
                          }
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                      }}
                    >
                      <Button variant='contained' color='error' disabled={disableRouteDelete}>
                        Delete Route
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
                      <Typography variant='h6'>Deactivate Route</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity='success'>
                        <AlertTitle>Route Status</AlertTitle>
                        This route is currently active
                      </Alert>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                      }}
                    >
                      <Button variant='contained' color='error'>
                        Deactivate Route
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default ViewRoute
