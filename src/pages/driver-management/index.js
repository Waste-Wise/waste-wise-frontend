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
import { styled, useTheme } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import { MuiOtpInput } from 'mui-one-time-password-input'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { default as Avatar, default as CustomAvatar } from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import apiDefinitions from 'src/api/apiDefinitions'
import themeConfig from 'src/configs/themeConfig'
import Swal from 'sweetalert2'

import jwt from 'jsonwebtoken'

import smsApi from '../../api/sendSMS'

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
    return <CustomAvatar src={row.driver_avatar} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
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
  const theme = useTheme()

  const branchDetails = JSON.parse(window.localStorage.getItem('BranchDetails'))

  const [generatedOTP, setGeneratedOTP] = useState('123456')

  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpCountDown, setOtpCountDown] = useState(60)
  const [otpCount, setOtpCount] = useState(0)
  const [otpError, setOtpError] = useState('')

  const [smsToken, setSmsToken] = useState('')

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
      field: 'assigned_schedule',
      headerName: 'Schedule',

      renderCell: params =>
        params.row.assigned_schedule ? (
          <Typography variant='body2'>
            <LinkStyled href='/'>{params.row.assigned_schedule}</LinkStyled>
          </Typography>
        ) : (
          <Typography variant='body2' sx={{ fontStyle: 'italic' }}>
            No Schedule Assigned
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
  const [otpDialog, setOtpDialog] = useState(false)

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
  const [assignSchedule, setAssignSchedule] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('/images/misc/default-photo-upload.png')

  const [branchVehicles, setBranchVehicles] = useState([])
  const [branchVehiclesError, setBranchVehiclesError] = useState('')

  const [searchValue, setSearchValue] = useState('')
  const [filteredRows, setFilteredRows] = useState([])
  const [filteredRowCount, setFilteredRowCount] = useState(0)

  const [refreshData, setRefreshData] = useState(false)

  useEffect(() => {
    const filteredData = rows.filter(row => {
      return (
        row.driver_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.emp_no?.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.assigned_vehicle?.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.assigned_schedule?.toLowerCase().includes(searchValue.toLowerCase())
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
    setAssignSchedule('')
    setProfilePhoto('/images/misc/default-photo-upload.png')

    setOtp('')
    setOtpSent(false)
    setOtpVerified(false)
    setOtpCountDown('')
    setOtpCount(0)
    setOtpError('')
  }

  const handleCloseDialogOTP = () => {
    setOtpDialog(false)
    setOtp('')
    setOtpError('')
    setOtpCountDown('')
    setOtpCount(0)
    setOtpSent(false)
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

    if (branchVehicles.length > 0 && !branchVehiclesError.length) {
      apiDefinitions
        .getBranchDrivers(branchDetails.branch_id)
        .then(response => {
          if (response.status === 200) {
            const drivers = response.data.data.map(driver => ({
              id: driver._id,
              driver_avatar: driver.avatar,
              driver_name: driver.name,
              emp_no: driver.empNum,
              assigned_vehicle:
                driver.assignedVehicle && branchVehicles?.length > 0
                  ? branchVehicles.find(vehicle => vehicle._id === driver.assignedVehicle)?.number ||
                    driver.assignedVehicle
                  : '',
              assigned_schedule: driver.assignedSchedule,
              driver_email: driver.email,
              driver_phone: driver.mobileNumber,
              driver_nic: driver.nic
            }))

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
    } else {
      apiDefinitions
        .getBranchVehicles(branchDetails.branch_id)
        .then(response => {
          if (response.status === 200) {
            if (response.data.data.length > 0) {
              setBranchVehicles(response.data.data)
              setBranchVehiclesError('')
            } else {
              setBranchVehiclesError('No vehicles found')
              throw new Error('No vehicles found')
            }
          } else {
            console.log('error', response)
            throw new Error('Failed to fetch vehicles')
          }
        })
        .catch(error => {
          console.log('error', error)
          setBranchVehiclesError('Failed to fetch vehicles')
          setLoadError('Failed to fetch vehicles!')
          setLoading(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchDetails.branch_id, refreshData, branchVehicles])

  const handleAddDriver = () => {
    let error = false
    if (employeeNumber === '') {
      setEmployeeNumberError('Employee Number is required')
      error = true
    }
    if (driverName === '') {
      setDriverNameError('Driver Name is required')
      error = true
    }
    if (phoneNumber === '') {
      setPhoneNumberError('Phone Number is required')
      error = true
    }
    if (driverNIC === '') {
      setDriverNICError('Driver NIC is required')
      error = true
    }

    if (!otpVerified) {
      setPhoneNumberError('Please verify your phone number!')
      error = true
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
      driverEmailError === '' &&
      !error
    ) {
      const newDriver = {
        empNum: employeeNumber,
        name: driverName,
        email: driverEmail,
        mobileNumber: phoneNumber,
        nic: driverNIC,
        assignedVehicle: assignVehicle,

        // assignedSchedule: assignSchedule,
        assignedSchedule: '66261dbd56cfa838630729a7',
        avatar: profilePhoto === '/images/misc/default-photo-upload.png' ? '' : profilePhoto,
        password: driverNIC
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
              if (response.status === 201) {
                // toast.success('Driver added successfully!')
                setRefreshData(!refreshData)
                handleCloseDialog()

                const smsMsg = `Thank you for registering to WasteWise. Your login credentials are as follows: \nUsername: ${phoneNumber}\nPassword: ${driverNIC}\nPlease change your password after logging in.`

                const tokenExpiry = jwt.decode(smsToken).exp

                if (tokenExpiry < Date.now() / 1000) {
                  smsApi
                    .login()
                    .then(token => {
                      setSmsToken(token)
                      smsApi
                        .sendSMS(phoneNumber, smsMsg, token)
                        .then(response => {
                          if (response.status === 200) {
                            Swal.fire(
                              'Registration Success!',
                              'Driver has been registered successfully! Login credentials has been sent to Driver.',
                              'success'
                            )
                          } else {
                            throw new Error('Failed to send SMS!')
                          }
                        })
                        .catch(error => {
                          console.log('error', error)
                          throw new Error('Failed to send SMS!')
                        })
                    })
                    .catch(error => {
                      console.log('error', error)

                      Swal.fire(
                        'Registration Success!',
                        'Driver has been registered successfully! Failed to send SMS.',
                        'error'
                      )
                    })
                } else {
                  smsApi
                    .sendSMS(phoneNumber, smsMsg, smsToken)
                    .then(response => {
                      if (response.status === 200) {
                        Swal.fire(
                          'Registration Success!',
                          'Driver has been registered successfully! Login credentials has been sent to Driver.',
                          'success'
                        )
                      } else {
                        throw new Error('Failed to send SMS!')
                      }
                    })
                    .catch(error => {
                      console.log('error', error)

                      Swal.fire(
                        'Registration Success!',
                        'Driver has been registered successfully! Failed to send SMS.',
                        'error'
                      )
                    })
                }
              } else {
                throw new Error('Failed to add driver!')
              }
            })
            .catch(error => {
              console.log('error', error)
              Swal.fire(
                'Error!',
                `Failed to add driver! ${error?.response?.data?.message ? error?.response?.data?.message : error}`,
                'error'
              )
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Driver not added :)', 'info')
        }
      })
    }
  }

  const sendOTP = () => {
    //generate random 6 digit number
    const newOTP = Math.floor(100000 + Math.random() * 900000)
    console.log('OTP:', newOTP)

    setGeneratedOTP(newOTP)

    const otpMsg = `Your OTP for WasteWise is ${newOTP}. Please do not share this with anyone.`

    /* Comment following when uncommenting SMS code */
    // setOtpSent(true)
    // setOtpCount(otpCount + 1)
    // setOtpCountDown(60 * (otpCount + 1))
    // setOtpDialog(true)

    //send OTP to the phone number
    smsApi
      .login()
      .then(token => {
        setSmsToken(token)
        smsApi
          .sendSMS(phoneNumber, otpMsg, token)
          .then(response => {
            if (response.status === 200) {
              setOtpSent(true)
              setOtpCount(otpCount + 1)
              setOtpCountDown(60 * (otpCount + 1))
              setOtpDialog(true)
            } else {
              throw new Error('Failed to send OTP!')
            }
          })
          .catch(error => {
            console.log('error', error)
            toast.error('Failed to send OTP!')
          })
      })
      .catch(error => {
        console.log('error', error)
        toast.error('Failed to send OTP!')
      })
  }

  useEffect(() => {
    if (otpSent) {
      if (otpCountDown === 0) {
        setOtpCountDown('')
        setOtpSent(false)
      } else {
        const interval = setInterval(() => {
          setOtpCountDown(otpCountDown => otpCountDown - 1)
        }, 1000)

        return () => clearInterval(interval)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpCountDown, otpSent])

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
            <Grid item xs={8}>
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
            <Grid item xs={4}>
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
            <Grid item xs={8}>
              <TextField
                id='outlined-basic'
                label='Driver Phone Number'
                variant='outlined'
                fullWidth
                type='number'
                placeholder='7XXXXXXXX'
                disabled={otpVerified || otpSent}
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
                helperText={
                  phoneNumberError.length > 0 ? (
                    phoneNumberError
                  ) : otpVerified ? (
                    <Link
                      href='/'
                      onClick={e => {
                        e.preventDefault()
                        setOtpVerified(false)
                      }}
                    >
                      <Typography variant='caption'>Change Number?</Typography>
                    </Link>
                  ) : null
                }
                required
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1 }}>+94</Box>
                }}
                size='small'
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant='contained'
                disabled={
                  otpVerified ||
                  otpSent ||
                  (phoneNumberError.length > 0 && !phoneNumberError === 'Please verify your phone number!') ||
                  phoneNumber.length !== 9
                }
                onClick={() => {
                  sendOTP()
                }}
              >
                {otpVerified ? 'OTP Verified' : 'Send OTP'}
              </Button>
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
                <InputLabel id='demo-simple-select-label'>Assign Schedule</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Assign Schedule'
                  value={assignSchedule}
                  onChange={e => setAssignSchedule(e.target.value)}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value='Schedule 1'>Schedule 1</MenuItem>
                  <MenuItem value='Schedule 2'>Schedule 2</MenuItem>
                  <MenuItem value='Schedule 3'>Schedule 3</MenuItem>
                  <MenuItem value='Schedule 4'>Schedule 4</MenuItem>
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
      <Dialog
        open={otpDialog}
        onClose={handleCloseDialogOTP}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        scroll='paper'
      >
        <DialogTitle variant='h5'>
          <CustomCloseButton aria-label='close' onClick={handleCloseDialogOTP}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box
              sx={{
                transform: 'rotate(180deg)'
              }}
            >
              <svg width={80} fill='none' height={70} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fillOpacity='0.4'
                  fill='url(#paint0_linear_7821_79167)'
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fillOpacity='0.4'
                  fill='url(#paint1_linear_7821_79167)'
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
                />
                <defs>
                  <linearGradient
                    y1='0'
                    x1='25.1443'
                    x2='25.1443'
                    y2='143.953'
                    id='paint0_linear_7821_79167'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop />
                    <stop offset='1' stopOpacity='0' />
                  </linearGradient>
                  <linearGradient
                    y1='0'
                    x1='25.1443'
                    x2='25.1443'
                    y2='143.953'
                    id='paint1_linear_7821_79167'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop />
                    <stop offset='1' stopOpacity='0' />
                  </linearGradient>
                </defs>
              </svg>
            </Box>
            <Typography variant='h5' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6, px: 6 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography variant='h5'>Two Step Verification</Typography>
              <img src='/images/misc/mobile-phone-with-arrow.webp' alt='sms' width='35' />
            </Box>
            <Typography sx={{ color: 'text.secondary' }}>
              We sent a verification code to your mobile. Enter the code from the mobile in the field below.
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 700 }}>******{phoneNumber.slice(-4)}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: 6
            }}
          >
            <MuiOtpInput
              value={otp}
              onChange={value => {
                setOtpError('')
                setOtp(value)
              }}
              autoFocus
              length={6}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%'
              }}
            >
              {otpError.length > 0 && (
                <Typography sx={{ color: 'error.main', mt: 2, mb: 2, textAlign: 'center' }}>{otpError}</Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 6, px: 10 }}>
            <Button
              variant='contained'
              fullWidth
              onClick={() => {
                if (otp == generatedOTP) {
                  setOtpVerified(true)
                  setPhoneNumberError('')
                  setOtpSent(false)
                  setOtpDialog(false)
                } else {
                  setOtpError('Invalid OTP! Please try again.')
                }
              }}
            >
              Verify OTP
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, px: 6 }}>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Didn't get the code? &nbsp;
            </Typography>
            {otpCountDown > 0 ? (
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Resend in {otpCountDown}s
              </Typography>
            ) : (
              <LinkStyled
                href='/'
                onClick={e => {
                  e.preventDefault()
                  sendOTP()
                }}
              >
                Resend OTP
              </LinkStyled>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ManageDrivers
