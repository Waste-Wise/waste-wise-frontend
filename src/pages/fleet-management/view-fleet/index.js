// ** MUI Imports
import { Icon } from '@iconify/react'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Chip
} from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

import { styled } from '@mui/material/styles'

// ** Custom Components
import apiDefinitions from 'src/api/apiDefinitions'

import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
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

const ViewFleet = () => {
  const [columns, setColumns] = useState([
    {
      flex: 0.15,
      minWidth: 150,
      field: 'vehicle_number',
      headerName: 'Vehicle Number',

      renderCell: params => <Typography variant='body2'>{params.row.vehicle_number}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'vehicle_type',
      headerName: 'Vehicle Type',

      renderCell: params => <Typography variant='body2'>{params.row.vehicle_type}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'vehicle_status',
      headerName: 'Vehicle Status',
      align: 'center',
      headerAlign: 'center',

      renderCell: params => (
        <Chip
          variant='outlined'
          label={params.row.vehicle_status}
          color={params.row.vehicle_status === 'Active' ? 'success' : 'error'}
          sx={{
            textTransform: 'capitalize',
            px: 3
          }}
        />
      )
    },
    {
      flex: 0.2,
      minWidth: 200,
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      field: 'actions',
      headerName: 'Actions',

      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3, justifyContent: 'space-around', width: '100%' }}>
            {/* <Button variant='outlined' color='primary'>
              Track Location
            </Button> */}

            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                window.location.href = `/fleet-management/track-fleet?id=${params.row.id}`
              }}
            >
              <Icon icon='grommet-icons:map-location' fontSize={20} />
            </Button>
            {/* <Button variant='contained' color='warning'>
              <Icon icon='bi:pencil-square' fontSize={20} />
            </Button> */}
            <Button
              variant='contained'
              color='error'
              disabled={params.row.vehicle_status === 'Active'}
              onClick={() => {
                Swal.fire({
                  title: 'Are you sure?',
                  text: 'Do you want to delete this vehicle?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete it!',
                  cancelButtonText: 'No, cancel!',
                  reverseButtons: true
                }).then(result => {
                  if (result.isConfirmed) {
                    apiDefinitions
                      .deleteVehicle(params.row.id)
                      .then(response => {
                        if (response.status === 200) {
                          toast.success('Vehicle deleted successfully!')
                          setRefreshData(!refreshData)
                        } else {
                          toast.error('Failed to delete vehicle!')
                        }
                      })
                      .catch(error => {
                        console.log('error', error)
                        toast.error('Failed to delete vehicle!')
                      })
                  } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire('Cancelled', 'Vehicle not deleted :)', 'info')
                  }
                })
              }}
            >
              <Icon icon='bi:trash' fontSize={20} />
            </Button>
          </Box>
        )
      }
    }
  ])

  const branchDetails = JSON.parse(window.localStorage.getItem('BranchDetails'))

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [refreshData, setRefreshData] = useState(false)

  const [vehicleNum, setVehicleNum] = useState('')
  const [vehicleNumerror, setVehicleNumError] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [vehicleTypeError, setVehicleTypeError] = useState('')

  const [searchValue, setSearchValue] = useState('')

  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])

  const [rowCount, setRowCount] = useState(0)
  const [filteredRowCount, setFilteredRowCount] = useState(0)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (!branchDetails?.branch_id) {
      return
    }

    setLoading(true)
    setLoadError('')

    apiDefinitions
      .getBranchVehicles(branchDetails.branch_id)
      .then(response => {
        if (response.status === 200) {
          const vehicles = response.data.data.map(vehicle => {
            return {
              id: vehicle._id,
              vehicle_number: vehicle.number,
              vehicle_status: vehicle.isDriverAssigned ? 'Active' : 'Inactive',
              vehicle_type: vehicle.type
            }
          })

          setRows(vehicles)
          setRowCount(vehicles.length)
        } else {
          toast.error('Failed to fetch vehicles!')
          setLoadError('Failed to fetch vehicles!')
        }
      })
      .catch(error => {
        console.log('error', error)
        toast.error('Failed to fetch vehicles!')
        setLoadError('Failed to fetch vehicles!')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [branchDetails.branch_id, refreshData])

  useEffect(() => {
    const filteredData = rows.filter(row => {
      return row.vehicle_number.toLowerCase().includes(searchValue.toLowerCase())
    })

    setFilteredRows(filteredData)
    setFilteredRowCount(filteredData.length)
  }, [searchValue, rows])

  const handleCloseDialog = () => {
    setOpenDialog(false)

    setVehicleNum('')
    setVehicleNumError('')
    setVehicleType('')
    setVehicleTypeError('')
  }

  const handleAddVehicle = () => {
    if (vehicleNum === '') {
      setVehicleNumError('Vehicle Number is required')
    }
    if (vehicleType === '') {
      setVehicleTypeError('Vehicle Type is required')
    }

    if (vehicleNum !== '' && vehicleType !== '' && vehicleNumerror === '' && vehicleTypeError === '') {
      const newVehicle = {
        number: vehicleNum,
        type: vehicleType

        // vehicle_status: 'Inactive'
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this vehicle?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then(result => {
        if (result.isConfirmed) {
          apiDefinitions
            .addVehicleToBranch(branchDetails.branch_id, newVehicle)
            .then(response => {
              if (response.status === 201) {
                toast.success('Vehicle added successfully!')
                setRefreshData(!refreshData)
                handleCloseDialog()
              } else {
                toast.error('Failed to add vehicle!')
              }
            })
            .catch(error => {
              console.log('error', error)
              toast.error('Failed to add vehicle!')
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Vehicle not added :)', 'info')
        }
      })
    }
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Manage Vehicles</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <TextField
                  id='outlined-basic'
                  label='Search'
                  variant='outlined'
                  size='small'
                  sx={{ width: '300px' }}
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                />
              }
              action={
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpenDialog(true)
                  }}
                >
                  <Icon icon='mdi:plus' fontSize={20} />
                  Add Vehicle
                </Button>
              }
            />
            <CardContent>
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '53vh',
                    flexDirection: 'column'
                  }}
                >
                  <CircularProgress />
                  <Typography variant='h6' sx={{ mt: 2 }}>
                    Loading...
                  </Typography>
                </Box>
              ) : loadError.length ? (
                <Alert severity='error'>
                  <AlertTitle>Error</AlertTitle>
                  {loadError}
                </Alert>
              ) : (
                <DataGrid
                  autoHeight
                  getRowHeight={() => 'auto'}
                  rows={searchValue.length > 0 ? filteredRows : rows}
                  rowCount={searchValue.length > 0 ? filteredRowCount : rowCount}
                  columns={columns}
                  pageSizeOptions={[5, 10, 25, 50]}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  disableRowSelectionOnClick
                />
              )}
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
        <DialogTitle variant='h5'>
          Add New Vehicle
          <CustomCloseButton aria-label='close' onClick={handleCloseDialog}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent
          sx={{
            width: '600px'
          }}
        >
          <Grid container spacing={3} sx={{ pt: 3 }}>
            <Grid item xs={6}>
              <FormControl fullWidth required error={vehicleTypeError.length > 0}>
                <InputLabel id='demo-simple-select-label'>Vehicle Type</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Vehicle Type'
                  value={vehicleType}
                  onChange={e => {
                    setVehicleType(e.target.value)

                    if (e.target.value === '') {
                      setVehicleTypeError('Vehicle Type is required')
                    } else {
                      setVehicleTypeError('')
                    }
                  }}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value='Tractor'>Tractor</MenuItem>
                  <MenuItem value='Mini Truck'>Mini Truck</MenuItem>
                  <MenuItem value='Truck'>Truck</MenuItem>
                </Select>
                <FormHelperText>{vehicleTypeError}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={vehicleNum}
                id='outlined-basic'
                label='Vehicle Number'
                variant='outlined'
                fullWidth
                required
                error={vehicleNumerror.length > 0}
                helperText={vehicleNumerror}
                onChange={e => {
                  const input = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                  let formattedInput = input.replace(/^([A-Z]{2,3})-?(\d{0,4})$/, '$1-$2')

                  const isValid = /^[A-Z]{2,3}-\d{4}$/.test(formattedInput) // Ensure exactly 4 digits after the hyphen

                  if (isValid) {
                    setVehicleNumError('')
                  } else {
                    if (formattedInput.length === 0) {
                      setVehicleNumError('Vehicle Number is required')
                    } else {
                      setVehicleNumError('Invalid Vehicle Number')
                    }
                  }
                  setVehicleNum(formattedInput)
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' sx={{ px: 4 }} onClick={handleAddVehicle}>
            Add Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ViewFleet
