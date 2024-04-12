import { Avatar, Badge, Box, Card, CardContent, Grid, Typography, Button } from '@mui/material'
import { useRouter } from 'next/router'

import UserProfileHeader from './UserProfileHeader'
import DriverAbout from './driver-profile/DriverAbout'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useState } from 'react'

import { Icon } from '@iconify/react'
import { styled } from '@mui/material/styles'

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 30,
  height: 30,
  border: `2px solid ${theme.palette.background.paper}`
}))

const DriverProfile = () => {
  const router = useRouter()

  const driverId = router.query.id

  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    console.log('value', value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
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
                <DriverAbout />
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
                  <Tab
                    icon={<Icon icon='mdi:timetable' fontSize={20} />}
                    iconPosition='start'
                    label='Assigned Schedules'
                    value='2'
                  />
                  <Tab
                    icon={<Icon icon='flowbite:user-settings-solid' fontSize={20} />}
                    iconPosition='start'
                    label='User Settings'
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
                      minHeight: 'calc(100vh - 425px )',
                      width: '100%'
                    }}
                  >
                    {value === '1' && (
                      <Grid container spacing={6}>
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
                        </Grid>
                      </Grid>
                    )}
                    {value === '2' && <div>Assigned Schedules</div>}
                    {value === '3' && <div>User Settings</div>}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DriverProfile
