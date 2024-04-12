import { Card, CardContent, Grid } from '@mui/material'
import { useRouter } from 'next/router'

import UserProfileHeader from './UserProfileHeader'
import DriverAbout from './driver-profile/DriverAbout'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useState } from 'react'

import { Icon } from '@iconify/react'

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
                    height: '100%'
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      height: '100%'
                    }}
                  >
                    Hello
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
