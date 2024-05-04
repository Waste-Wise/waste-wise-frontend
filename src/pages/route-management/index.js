import { Icon } from '@iconify/react'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import { debounce } from '@mui/material/utils'
import { DataGrid } from '@mui/x-data-grid'
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

// import { rows } from '../../@fake-db/mock-data/routes'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import apiDefinitions from 'src/api/apiDefinitions'

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

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: theme.palette.grey[500], // Changed 'grey.500' to theme.palette.grey[500]
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const ManageRoutes = () => {
  const router = useRouter()
  const [inputValueEdit, setInputValueEdit] = useState('')
  const [optionsEdit, setOptionsEdit] = useState([])

  const branchDetails = JSON.parse(window.localStorage.getItem('BranchDetails'))

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

  const [selectedWayPoints, setSelectedWayPoints] = useState(['', ''])

  const [rows, setRows] = useState([])

  useEffect(() => {
    apiDefinitions
      .getAllRoutes(branchDetails.branch_id)
      .then(res => {
        if (res.status === 200) {
          console.log('Routes:', res.data.data)

          setRows(res.data.data)
        } else {
          throw new Error('Error fetching routes')
        }
      })
      .catch(error => {
        console.error('Error fetching routes:', error)
        toast.error('Error fetching routes!')
      })
  }, [])

  const loaded = useRef(false)

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogPage, setDialogPage] = useState(1)

  const [columns, setColumns] = useState([
    {
      flex: 0.075,
      minWidth: 80,
      field: 'route_id',
      headerName: 'Route ID',
      renderCell: params => <Typography variant='body2'>{params.row.route_id}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'route_name',
      headerName: 'Route Name',

      renderCell: params => <Typography variant='body2'>{params.row.route_name}</Typography>
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'route_start',
      headerName: 'Start',

      renderCell: params => <Typography variant='body2'>{params.row.route_start}</Typography>
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'route_end',
      headerName: 'End',

      renderCell: params => <Typography variant='body2'>{params.row.route_end}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'route_distance',
      headerName: 'Distance',

      renderCell: params => <Typography variant='body2'>{params.row.route_distance} KM</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'route_duration',
      headerName: 'Duration',

      renderCell: params => <Typography variant='body2'>{params.row.route_duration} Hours</Typography>
    },

    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   field: 'route_status',
    //   headerName: 'Status',

    //   renderCell: params => (
    //     <CustomChip
    //       label={params.row.route_status}
    //       color={params.row.route_status === 'Active' ? 'success' : 'error'}
    //     />
    //   )
    // },
    {
      flex: 0.125,
      minWidth: 180,
      field: 'actions',
      headerName: 'Actions',

      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => {
                router.push(`/route-management/view-route?id=${params.row._id}&viewType=view`)
              }}
            >
              View Route
            </Button>
          </Box>
        )
      }
    }
  ])

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const handleCloseDialog = () => {
    setOpenDialog(false)

    setDialogPage(1)
    setRouteName('')
    setRouteNameError('')
    setRouteStart('')
    setRouteStartError('')
    setRouteEnd('')
    setRouteEndError('')
    setRouteDistance('')
    setRouteDistanceError('')
    setRouteDuration('')
    setRouteDurationError('')
    setSelectedWayPoints(['', ''])
    setInputValueEdit('')
    setOptionsEdit([])
  }

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
    if (selectedWayPoints.length === 2 && selectedWayPoints[1] === '' && selectedWayPoints[0] === '') {
      toast.error('Please fill the start and end waypoints before adding a new one!')

      return
    }

    if (selectedWayPoints.length > 0 && selectedWayPoints[selectedWayPoints.length - 1] === '') {
      toast.error('Please fill the last waypoint before adding a new one!')
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
    // Initialize map when dialog is open and dialogPage is 2
    if (openDialog && dialogPage === 2) {
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
    }
  }, [openDialog, dialogPage, selectedWayPoints])

  const handleSaveRoute = () => {
    const geocoder = new window.google.maps.Geocoder()

    const geocodePromise = waypoint => {
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: waypoint.description }, (results, status) => {
          if (status === 'OK') {
            const lat = results[0].geometry.location.lat()
            const lng = results[0].geometry.location.lng()

            const position = { lat, lng }
            resolve({ ...waypoint, position })
          } else {
            reject(status)
          }
        })
      })
    }

    const waypointsPromises = selectedWayPoints.map(waypoint => geocodePromise(waypoint))

    Promise.all(waypointsPromises)
      .then(waypoints => {
        const payload = {
          route_name: routeName,
          route_start: routeStart,
          route_end: routeEnd,
          route_distance: routeDistance,
          route_duration: routeDuration,
          route_stops: waypoints // Use waypoints with geolocation
        }

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to save this route?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, save it!',
          cancelButtonText: 'No, cancel!'
        }).then(result => {
          if (result.isConfirmed) {
            apiDefinitions
              .createRoute(branchDetails.branch_id, payload)
              .then(res => {
                if (res.status === 201) {
                  toast.success('Route saved successfully!')
                  setOpenDialog(false)
                  router.push(`/route-management/view-route?id=${res.data.data._id}&viewType=view`)
                }
              })
              .catch(error => {
                console.error('Error saving route:', error)
                toast.error('Error saving route!')
              })
          }
        })
      })
      .catch(error => {
        console.error('Geocoding error:', error)
      })
  }

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
              <DataGrid
                autoHeight
                getRowHeight={() => 'auto'}
                getRowId={row => row._id}
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        scroll='paper'
      >
        <DialogTitle
          variant='h5'
          sx={{
            pb: 0
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              px: 3
            }}
          >
            <Typography
              variant='h5'
              sx={{
                py: 2
              }}
            >
              Add New Route
            </Typography>
            {dialogPage === 1 && (
              <Button variant='contained' onClick={handleAddWayPoint} sx={{ px: 4 }}>
                <Icon icon='mdi:plus' fontSize={20} /> Add Route Stop
              </Button>
            )}
          </Box>
          <CustomCloseButton aria-label='close' onClick={handleCloseDialog}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent
          sx={{
            width: '600px',
            maxHeight: 'calc(100vh - 150px)',
            overflow: dialogPage === 1 ? 'hidden' : 'auto'
          }}
        >
          {dialogPage === 1 && (
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
                                        {selectedWayPoints.length > 2 && (
                                          <IconButton
                                            size='small'
                                            onClick={() => handleRemoveWayPoint(index)}
                                            sx={{ marginLeft: 'auto' }}
                                          >
                                            <Icon icon='mdi:close' />
                                          </IconButton>
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
            </Grid>
          )}

          {dialogPage === 2 && (
            <>
              <div
                id='map'
                style={{
                  width: '100%',
                  height: 'calc(100vh - 480px)'
                }}
              ></div>
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
          )}
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: 'flex',
              justifyContent: dialogPage > 1 ? 'space-between' : 'flex-end',
              width: '100%'
            }}
          >
            {dialogPage > 1 && (
              <Button variant='outlined' onClick={() => setDialogPage(prevPage => prevPage - 1)}>
                Previous
              </Button>
            )}
            {dialogPage === 1 ? (
              <Button
                variant='outlined'
                onClick={() => {
                  let error = true

                  routeName === ''
                    ? setRouteNameError('Route Name is required')
                    : selectedWayPoints.length < 2
                    ? toast.error('Please add at least 2 waypoints before saving the route!')
                    : selectedWayPoints[selectedWayPoints.length - 1] === ''
                    ? toast.error('Please fill the last waypoint before saving the route!')
                    : (error = false)

                  if (!error) {
                    setRouteStart(selectedWayPoints[0].description)
                    setRouteEnd(selectedWayPoints[selectedWayPoints.length - 1].description)
                    calculateTotalDistanceAndDuration().then(() => {
                      setDialogPage(prevPage => prevPage + 1)
                    })
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button variant='contained' onClick={handleSaveRoute}>
                Save Route
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ManageRoutes
