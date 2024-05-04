import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

import UserProfileHeader from './UserProfileHeader'
import DriverAbout from './driver-profile/DriverAbout'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useState, useEffect } from 'react'

import { Icon } from '@iconify/react'
import apiDefinitions from 'src/api/apiDefinitions'

import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { set } from 'nprogress'

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

const DriverProfile = () => {
  const router = useRouter()

  const branchDetails = JSON.parse(window.localStorage.getItem('BranchDetails'))

  const driverId = router.query.id
  const [loading, setLoading] = useState(true)
  const [isDriverFound, setIsDriverFound] = useState(false)

  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [openDialog, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const [refresh, setRefresh] = useState(false)

  const [driverDetails, setDriverDetails] = useState([])

  const [profilePhoto, setProfilePhoto] = useState('/static/images/avatars/avatar_6.png')

  const [employeeNumber, setEmployeeNumber] = useState('')
  const [employeeNumberError, setEmployeeNumberError] = useState('')
  const [driverName, setDriverName] = useState('')
  const [driverNameError, setDriverNameError] = useState('')
  const [driverEmail, setDriverEmail] = useState('')
  const [driverEmailError, setDriverEmailError] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumberError, setPhoneNumberError] = useState('')
  const [driverNIC, setDriverNIC] = useState('')
  const [driverNICError, setDriverNICError] = useState('')

  const clearErrors = () => {
    setEmployeeNumberError('')
    setDriverNameError('')
    setDriverEmailError('')
    setPhoneNumberError('')
    setDriverNICError('')
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

    apiDefinitions
      .getBranchVehicles(branchDetails.branch_id)
      .then(response => {
        if (response.status === 200) {
          if (response.data.data.length > 0) {
            setBranchVehicles(response.data.data)
          } else {
            throw new Error('No vehicles found')
          }
        } else {
          console.log('error', response)
          throw new Error('Failed to fetch vehicles')
        }
      })
      .catch(error => {
        console.log('error', error)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchDetails.branch_id])

  useEffect(() => {
    setLoading(true)

    if (!driverId) {
      setIsDriverFound(false)
      setLoading(false)
    } else {
      apiDefinitions
        .getDriverById(driverId)
        .then(response => {
          if (response.status === 200) {
            console.log('response', response.data.data)
            setDriverDetails(response.data.data)

            setEmployeeNumber(response.data.data.empNum)
            setDriverName(response.data.data.name)
            setDriverEmail(response.data.data.email)
            setPhoneNumber(response.data.data.mobileNumber)
            setDriverNIC(response.data.data.nic)
            setProfilePhoto(response.data.data.avatar)

            setIsDriverFound(true)
          } else {
            throw new Error('Driver not found')
          }
        })
        .catch(error => {
          console.log('error', error)
          setIsDriverFound(false)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [driverId, refresh])

  const handleDriverUpdate = () => {
    let error = true

    if (driverName.length === 0) {
      setDriverNameError('Driver name is required')
      error = false
    }

    if (driverNIC.length === 0) {
      setDriverNICError('Driver NIC is required')
      error = false
    }

    if (driverNameError.length === 0 && driverNICError.length === 0 && driverEmailError.length === 0 && error) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to update the driver details',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel'
      }).then(result => {
        if (result.isConfirmed) {
          apiDefinitions
            .updateDriver(driverId, {
              name: driverName,
              email: driverEmail,
              nic: driverNIC,
              avatar: profilePhoto
            })
            .then(response => {
              if (response.status === 200) {
                toast.success('Driver details updated successfully')
                setRefresh(!refresh)
                handleCloseDialog()
              } else {
                toast.error('Failed to update driver details')
              }
            })
            .catch(error => {
              console.log('error', error)
              toast.error('Failed to update driver details')
            })
        }
      })
    }
  }

  return loading ? (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 210px)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <CircularProgress size={50} />
            <Typography variant='body1'>Loading driver profile...</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : isDriverFound ? (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserProfileHeader driverDetails={driverDetails} />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={12} lg={4}>
              <Card
                sx={{
                  display: 'flex',
                  height: '100%'
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    height: '100%'
                  }}
                >
                  <DriverAbout driverDetails={driverDetails} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={8}>
              <Grid container spacing={3.5}>
                <Grid item xs={12}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label='icon position tabs example'
                    sx={{
                      height: '60px'
                    }}
                  >
                    <Tab
                      icon={<Icon icon='mdi:truck' fontSize={20} />}
                      iconPosition='start'
                      label='Assigned Vehicles'
                      value='1'
                    />
                    {/* <Tab
                      icon={<Icon icon='mdi:timetable' fontSize={20} />}
                      iconPosition='start'
                      label='Assigned Schedules'
                      value='2'
                    /> */}
                    <Tab
                      icon={<Icon icon='flowbite:user-settings-solid' fontSize={20} />}
                      iconPosition='start'
                      label='Driver Settings'
                      value='3'
                    />
                  </Tabs>
                </Grid>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      display: 'flex',
                      height: '100%',
                      width: '100%'
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        minHeight: 'calc(100vh - 433px )',
                        width: '100%'
                      }}
                    >
                      {value === '1' && (
                        <Grid container spacing={4}>
                          {driverDetails.assignedVehicle?.number ? (
                            <Grid item xs={6}>
                              <Box
                                sx={{
                                  backgroundColor: 'background.paper',
                                  borderRadius: 1,
                                  boxShadow: 5,
                                  minHeight: '100px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 4,
                                  px: 4,
                                  width: '100%'
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
                                  <Avatar sx={{ width: 60, height: 60 }}>
                                    <Icon icon='bi:truck' width={30} height={30} />
                                  </Avatar>
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 3,
                                    gap: 1
                                  }}
                                >
                                  <Typography
                                    variant='body1'
                                    sx={{
                                      fontWeight: 600
                                    }}
                                  >
                                    {driverDetails.assignedVehicle?.number}
                                  </Typography>
                                  {/* <Button variant='contained' color='error' size='small'>
                                    Unassign
                                  </Button> */}
                                </Box>
                              </Box>
                            </Grid>
                          ) : (
                            <Grid item xs={12}>
                              <Alert severity='error'>
                                <AlertTitle>ERROR</AlertTitle>
                                <Typography variant='body2' color='inherit'>
                                  The driver is not assigned to any vehicles at the moment.
                                </Typography>
                              </Alert>
                            </Grid>
                          )}
                          {/* <Grid item xs={6}>
                            <Box
                              sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: 1,
                                boxShadow: 5,
                                minHeight: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                px: 4,
                                width: '100%'
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
                                <Avatar sx={{ width: 60, height: 60 }}>
                                  <Icon icon='bi:truck' width={30} height={30} />
                                </Avatar>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  flex: 3,
                                  gap: 1
                                }}
                              >
                                <Typography
                                  variant='body1'
                                  sx={{
                                    fontWeight: 600
                                  }}
                                >
                                  KA-01-1234
                                </Typography>
                                <Button variant='contained' color='error' size='small'>
                                  Unassign
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: 1,
                                boxShadow: 5,
                                minHeight: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                px: 4,
                                width: '100%'
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
                                <Avatar sx={{ width: 60, height: 60 }}>
                                  <Icon icon='bi:truck' width={30} height={30} />
                                </Avatar>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  flex: 3,
                                  gap: 1
                                }}
                              >
                                <Typography
                                  variant='body1'
                                  sx={{
                                    fontWeight: 600
                                  }}
                                >
                                  KA-01-1234
                                </Typography>
                                <Button variant='contained' color='error' size='small'>
                                  Unassign
                                </Button>
                              </Box>
                            </Box>
                          </Grid> */}
                        </Grid>
                      )}
                      {value === '2' && (
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Alert severity='error'>
                              <AlertTitle>ERROR</AlertTitle>
                              <Typography variant='body2' color='inherit'>
                                The driver is not assigned to any schedules at the moment.
                              </Typography>
                            </Alert>
                          </Grid>

                          <Grid item xs={6}>
                            <Box
                              sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: 1,
                                boxShadow: 5,
                                minHeight: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                px: 4,
                                width: '100%'
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
                                <Avatar sx={{ width: 60, height: 60 }}>
                                  <Icon icon='healthicons:i-schedule-school-date-time' width={30} height={30} />
                                </Avatar>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  flex: 3,
                                  gap: 1
                                }}
                              >
                                <Typography
                                  variant='body1'
                                  sx={{
                                    fontWeight: 600
                                  }}
                                >
                                  Schedule 01
                                </Typography>
                                <Button variant='contained' color='error' size='small'>
                                  Unassign
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                          {/* <Grid item xs={6}>
                            <Box
                              sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: 1,
                                boxShadow: 5,
                                minHeight: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                px: 4,
                                width: '100%'
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
                                <Avatar sx={{ width: 60, height: 60 }}>
                                  <Icon icon='healthicons:i-schedule-school-date-time' width={30} height={30} />
                                </Avatar>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  flex: 3,
                                  gap: 1
                                }}
                              >
                                <Typography
                                  variant='body1'
                                  sx={{
                                    fontWeight: 600
                                  }}
                                >
                                  Schedule 02
                                </Typography>
                                <Button variant='contained' color='error' size='small'>
                                  Unassign
                                </Button>
                              </Box>
                            </Box>
                          </Grid> */}
                        </Grid>
                      )}
                      {value === '3' && (
                        <Grid container spacing={3}>
                          <Grid item xs={7}>
                            <Typography
                              variant='h6'
                              sx={{
                                mb: 5
                              }}
                            >
                              Delete User
                            </Typography>
                            <Alert severity='error'>
                              <AlertTitle>WARNING!</AlertTitle>
                              <Typography variant='body2' color='inherit'>
                                Deleting the driver will remove the driver completely from the system. This action
                                cannot be undone.
                              </Typography>
                              <Box
                                sx={{
                                  mt: 5,
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'flex-end'
                                }}
                              >
                                <Button
                                  variant='contained'
                                  color='error'
                                  size='small'
                                  onClick={() => {
                                    Swal.fire({
                                      title: 'Are you sure?',
                                      text: 'You will not be able to recover this driver!',
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonText: 'Yes, delete it!',
                                      cancelButtonText: 'No, cancel!'
                                    }).then(result => {
                                      if (result.isConfirmed) {
                                        apiDefinitions
                                          .deleteDriver(driverId)
                                          .then(response => {
                                            if (response.status === 200) {
                                              toast.success('Driver deleted successfully')
                                              setTimeout(() => {
                                                router.push('/driver-management')
                                              }, 2000)
                                            } else {
                                              toast.error('Failed to delete driver')
                                            }
                                          })
                                          .catch(error => {
                                            console.log('error', error)
                                            toast.error('Failed to delete driver')
                                          })
                                      }
                                    })
                                  }}
                                >
                                  Delete Driver
                                </Button>
                              </Box>
                            </Alert>
                          </Grid>
                          <Grid item xs={5}>
                            <Grid container spacing={6}>
                              <Grid item xs={12}>
                                <Typography variant='h6'>Actions</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Button variant='outlined' color='primary' fullWidth onClick={handleOpenDialog}>
                                  Edit Driver Details
                                </Button>
                              </Grid>
                              {/* <Grid item xs={12}>
                                <Button variant='outlined' color='error' fullWidth>
                                  Deactivate Driver
                                </Button>
                              </Grid> */}
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
          Update Driver
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
                    disabled
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
                disabled
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: 'flex',
              gap: 2
            }}
          >
            <Button
              variant='outlined'
              onClick={e => {
                setRefresh(!refresh)
                clearErrors()
              }}
            >
              Reset
            </Button>

            <Button variant='contained' sx={{ px: 4 }} onClick={handleDriverUpdate}>
              Update Driver
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <Alert severity='error'>
      <AlertTitle>Driver not found</AlertTitle>
      {(!driverId || driverId === undefined) && <>Please provide a driver ID to view the driver profile.</>}
      {driverId && driverId !== undefined && (
        <>
          We cannot find the driver with ID <strong>{driverId}</strong>. Please check the driver ID and try again.
        </>
      )}
    </Alert>
  )
}

export default DriverProfile
