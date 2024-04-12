import { Grid, TextField, Select, InputLabel, age, MenuItem, Button, Box } from '@mui/material'
import React from 'react'
import Timetable from 'react-timetable-events'

const AnchorTemporaryDrawer = () => {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['left', 'right', 'top', 'bottom'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default AnchorTemporaryDrawer

const AddSchedule = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 5 }}>
            <TextField id='filled-basic' label='Schedule name' variant='outlined' />
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
          </Box>
          <Button variant='contained'>Add event</Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Timetable
          events={{
            monday: [
              {
                id: 1,
                name: 'Custom Event 1',
                type: 'custom',
                startTime: new Date('2018-02-23T11:30:00'),
                endTime: new Date('2018-02-23T13:30:00')
              }
            ],
            tuesday: [
              {
                id: 2,
                name: 'Custom Event 2',
                type: 'custom',
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
  )
}




export default AddSchedule
