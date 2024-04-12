import { Box, Button, Drawer, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import Timetable from 'react-timetable-events'

const AddSchedule = () => {
  const [drawerState, setDrawerState] = useState(false)

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 5 }}>
              <TextField id='filled-basic' label='Schedule name' variant='outlined' />
              <FormControl>
                <InputLabel id='demo-simple-select-label'>Driver</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  // value={age}
                  label='Age'

                  // onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button variant='contained' onClick={() => setDrawerState(true)}>
              Add Trip
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Timetable
            events={{
              monday: [
                {
                  id: 1,
                  name: 'Custom Event 1',
                  startTime: new Date('2018-02-23T11:30:00'),
                  endTime: new Date('2018-02-23T13:30:00')
                }
              ],
              tuesday: [
                {
                  id: 2,
                  name: 'Custom Event 2',
                  startTime: new Date('2018-02-23T14:00:00'),
                  endTime: new Date('2018-02-23T16:00:00')
                }
              ],
              wednesday: [],
              thursday: [],
              friday: []
            }}
            style={{ height: '500px' }}
          />
        </Grid>
      </Grid>

      <Drawer
        anchor='right'
        open={drawerState}
        onClose={() => setDrawerState(false)}
        sx={{
          width: 400,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 400,
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{ width: 400, padding: 2 }}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField id='filled-basic' label='Trip name' variant='outlined' fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='datetime-local'
                label='Trip start time'
                type='datetime-local'
                defaultValue='2017-05-24T10:30'
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='datetime-local'
                label='Trip end time'
                type='datetime-local'
                defaultValue='2017-05-24T10:30'
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Trip route</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  // value={age}
                  label='Event route'

                  // onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' fullWidth>
                Add trip
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}

export default AddSchedule
