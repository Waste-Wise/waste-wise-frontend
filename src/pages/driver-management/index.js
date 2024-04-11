// ** MUI Imports
import { Icon } from '@iconify/react'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

import Link from 'next/link'

import { styled } from '@mui/material/styles'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

import { useRouter } from 'next/router'
import apiDefinitions from 'src/api/apiDefinitions'

import toast from 'react-hot-toast'
import Avatar from 'src/@core/components/mui/avatar'

import Swal from 'sweetalert2'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.secondary.main,
  textDecoration: 'underline',
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

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

const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]
  if (row?.driver_avatar?.length) {
    return (
      <CustomAvatar
        src={`/images/avatars/${row.driver_avatar}`}
        sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }}
      />
    )
  } else {
    return (
      <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
        {getInitials(row.driver_name ? row.driver_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const ManageDrivers = () => {
  const router = useRouter()

  const branchDetails = JSON.parse(window.localStorage.getItem('BranchDetails'))

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [rows, setRows] = useState([])

  const [columns, setColumns] = useState([
    {
      flex: 0.275,
      minWidth: 290,
      field: 'driver_name',
      headerName: 'Name',

      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.driver_name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.emp_no}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Vehicle',
      field: 'assigned_vehicle',

      valueGetter: params => new Date(params.value),
      renderCell: params =>
        params.row.assigned_vehicle ? (
          <Typography variant='body2'>
            <LinkStyled href='/'>{params.row.assigned_vehicle}</LinkStyled>
          </Typography>
        ) : (
          <Typography variant='body2' sx={{ fontStyle: 'italic' }}>
            No Vehicle Assigned
          </Typography>
        )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'assigned_route',
      headerName: 'Route',

      renderCell: params =>
        params.row.assigned_route ? (
          <Typography variant='body2'>
            <LinkStyled href='/'>{params.row.assigned_route}</LinkStyled>
          </Typography>
        ) : (
          <Typography variant='body2' sx={{ fontStyle: 'italic' }}>
            No Route Assigned
          </Typography>
        )
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'actions',
      headerName: 'Actions',

      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => {
                router.push(`/driver-management/driver/view-profile?id=${params.row.id}`)
              }}
            >
              View Profile
            </Button>
          </Box>
        )
      }
    }
  ])

  const [rowCount, setRowCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [openDialog, setOpenDialog] = useState(false)

  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumberError, setPhoneNumberError] = useState('')
  const [driverName, setDriverName] = useState('')
  const [driverNameError, setDriverNameError] = useState('')
  const [driverEmail, setDriverEmail] = useState('')
  const [driverEmailError, setDriverEmailError] = useState('')
  const [driverNIC, setDriverNIC] = useState('')
  const [driverNICError, setDriverNICError] = useState('')
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [employeeNumberError, setEmployeeNumberError] = useState('')
  const [assignVehicle, setAssignVehicle] = useState('')
  const [assignRoute, setAssignRoute] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('/images/misc/default-photo-upload.png')

  const [branchVehicles, setBranchVehicles] = useState([])

  const [searchValue, setSearchValue] = useState('')
  const [filteredRows, setFilteredRows] = useState([])
  const [filteredRowCount, setFilteredRowCount] = useState(0)

  const [refreshData, setRefreshData] = useState(false)

  useEffect(() => {
    const filteredData = rows.filter(row => {
      return (
        row.driver_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.emp_no.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.assigned_vehicle.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.assigned_route.toLowerCase().includes(searchValue.toLowerCase())
      )
    })

    setFilteredRows(filteredData)
    setFilteredRowCount(filteredData.length)
  }, [rows, searchValue])

  const handleCloseDialog = () => {
    setOpenDialog(false)

    setPhoneNumber('')
    setPhoneNumberError('')
    setDriverName('')
    setDriverNameError('')
    setDriverEmail('')
    setDriverEmailError('')
    setDriverNIC('')
    setDriverNICError('')
    setEmployeeNumber('')
    setEmployeeNumberError('')
    setAssignVehicle('')
    setAssignRoute('')
    setProfilePhoto('/images/misc/default-photo-upload.png')
  }

  const handleFileUploader = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.click()

    fileInput.onchange = e => {
      const file = e.target.files[0]

      if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
          setProfilePhoto(reader.result)
        }
      }
    }
  }

  useEffect(() => {
    if (!branchDetails?.branch_id) {
      return
    }

    setLoading(true)
    setLoadError('')

    apiDefinitions
      .getBranchDrivers(branchDetails.branch_id)
      .then(response => {
        if (response.status === 200) {
          const drivers = response.data.data.map(driver => {
            return {
              id: driver._id,
              driver_avatar: driver.avatar,
              driver_name: driver.name,
              emp_no: driver.empNum,
              assigned_vehicle: driver.asssignedVehicle,
              assigned_route: driver.assignedRoute,
              driver_email: driver.email,
              driver_phone: driver.mobileNumber,
              driver_nic: driver.nic
            }
          })

          setRows(drivers)
          setRowCount(drivers.length)
        } else {
          toast.error('Failed to fetch drivers!')
          setLoadError('Failed to fetch drivers!')
        }
      })
      .catch(error => {
        console.log('error', error)
        toast.error('Failed to fetch drivers!')
        setLoadError('Failed to fetch drivers!')
      })
      .finally(() => {
        setLoading(false)
      })

    apiDefinitions
      .getBranchVehicles(branchDetails.branch_id)
      .then(response => {
        if (response.status === 200) {
          setBranchVehicles(response.data.data)
        } else {
          console.log('error', response)
        }
      })
      .catch(error => {
        console.log('error', error)
      })
  }, [branchDetails.branch_id, refreshData])

  const handleAddDriver = () => {
    if (employeeNumber === '') {
      setEmployeeNumberError('Employee Number is required')
    }
    if (driverName === '') {
      setDriverNameError('Driver Name is required')
    }
    if (phoneNumber === '') {
      setPhoneNumberError('Phone Number is required')
    }
    if (driverNIC === '') {
      setDriverNICError('Driver NIC is required')
    }

    if (
      employeeNumber !== '' &&
      driverName !== '' &&
      phoneNumber !== '' &&
      driverNIC !== '' &&
      employeeNumberError === '' &&
      driverNameError === '' &&
      phoneNumberError === '' &&
      driverNICError === '' &&
      driverEmailError === ''
    ) {
      const newDriver = {
        empNum: employeeNumber,
        name: driverName,
        email: driverEmail,
        mobileNumber: phoneNumber,
        nic: driverNIC,
        assignedVehicle: assignVehicle,
        assignedRoute: assignRoute,
        avatar: profilePhoto === '/images/misc/default-photo-upload.png' ? '' : profilePhoto
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this driver?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then(result => {
        if (result.isConfirmed) {
          apiDefinitions
            .addDriverToBranch(branchDetails.branch_id, newDriver)
            .then(response => {
              if (response.status === 200) {
                toast.success('Driver added successfully!')
                setRefreshData(!refreshData)
                handleCloseDialog()
              } else {
                toast.error('Failed to add driver!')
              }
            })
            .catch(error => {
              console.log('error', error)
              toast.error('Failed to add driver!')
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Driver not added :)', 'info')
        }
      })
    }
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Manage Drivers</Typography>
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
                  Add Driver
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
                  rows={searchValue.length ? filteredRows : rows}
                  rowCount={searchValue.length ? filteredRowCount : rowCount}
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
          Add New Driver
          <CustomCloseButton aria-label='close' onClick={handleCloseDialog}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent
          sx={{
            width: '600px'
          }}
        >
          <Grid container rowSpacing={8} columnSpacing={3} sx={{ pt: 3 }}>
            <Grid item xs={4}>
              <Avatar
                src={profilePhoto}
                alt='user avatar'
                sx={{
                  width: '120px',
                  height: '120px',
                  mx: 'auto',
                  ':hover': {
                    cursor: 'pointer'
                  }
                }}
                onClick={handleFileUploader}
              />
            </Grid>
            <Grid item xs={8}>
              <Grid container rowSpacing={8} columnSpacing={3}>
                <Grid item xs={12}>
                  <TextField
                    id='outlined-basic'
                    label='Employee Number'
                    variant='outlined'
                    fullWidth
                    required
                    value={employeeNumber}
                    onChange={e => {
                      setEmployeeNumberError('')

                      if (e.target.value.length === 0) {
                        setEmployeeNumberError('Employee number is required')
                      }

                      setEmployeeNumber(e.target.value)
                    }}
                    error={employeeNumberError.length > 0}
                    helperText={employeeNumberError}
                    size='small'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='outlined-basic'
                    label='Driver Name'
                    variant='outlined'
                    fullWidth
                    required
                    value={driverName}
                    onChange={e => {
                      setDriverNameError('')

                      if (e.target.value.length === 0) {
                        setDriverNameError('Driver name is required')
                      }

                      setDriverName(e.target.value)
                    }}
                    error={driverNameError.length > 0}
                    helperText={driverNameError}
                    size='small'
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='outlined-basic'
                label='Driver Email'
                variant='outlined'
                fullWidth
                value={driverEmail}
                onChange={e => {
                  setDriverEmailError('')

                  if (e.target.value.length === 0) {
                    return setDriverEmail(e.target.value)
                  }

                  const email = e.target.value.trim()
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

                  if (!emailPattern.test(email)) {
                    setDriverEmailError('Invalid email format')
                  }

                  setDriverEmail(e.target.value)
                }}
                error={driverEmailError.length > 0}
                helperText={driverEmailError}
                size='small'
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='outlined-basic'
                label='Driver Phone Number'
                variant='outlined'
                fullWidth
                type='number'
                placeholder='7XXXXXXXX'
                value={phoneNumber}
                onChange={e => {
                  const input = e.target.value.trim().slice(0, 9)
                  let error = ''

                  if (input.length === 0) {
                    error = 'Phone number is required'
                  } else {
                    const phoneNumberPattern = /^[7][0-9]{8}$/

                    if (!phoneNumberPattern.test(input)) {
                      error = 'Invalid phone number'
                    }
                  }

                  setPhoneNumber(input)

                  setPhoneNumberError(error)
                }}
                error={phoneNumberError.length > 0}
                helperText={phoneNumberError}
                required
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1 }}>+94</Box>
                }}
                size='small'
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='outlined-basic'
                label='Driver NIC'
                variant='outlined'
                fullWidth
                required
                value={driverNIC}
                onChange={e => {
                  const nic = e.target.value.trim()
                  const nicPattern = /^(?:\d{9}[VvXx]|\d{12})$/
                  let error = ''

                  setDriverNICError('')

                  if (nic.length === 0) {
                    error = 'Driver NIC is required'
                  } else if (!nicPattern.test(nic)) {
                    error = 'Invalid NIC'
                  }

                  setDriverNICError(error)
                  setDriverNIC(nic)
                }}
                error={driverNICError.length > 0}
                helperText={driverNICError}
                size='small'
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'>Assign Vehicle</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Assign Vehicle'
                  value={assignVehicle}
                  onChange={e => setAssignVehicle(e.target.value)}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {branchVehicles.map(vehicle => (
                    <MenuItem key={vehicle._id} value={vehicle._id}>
                      {vehicle.number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'>Assign Route</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Assign Route'
                  value={assignRoute}
                  onChange={e => setAssignRoute(e.target.value)}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value='Route 1'>Route 1</MenuItem>
                  <MenuItem value='Route 2'>Route 2</MenuItem>
                  <MenuItem value='Route 3'>Route 3</MenuItem>
                  <MenuItem value='Route 4'>Route 4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' sx={{ px: 4 }} onClick={handleAddDriver}>
            Add Driver
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ManageDrivers
