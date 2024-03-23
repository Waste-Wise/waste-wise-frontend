// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'
import { Icon } from '@iconify/react'

import Link from 'next/link'

import { styled } from '@mui/material/styles'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rows } from './static-data'

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
  // const [rows, setRows] = useState([])

  const [columns, setColumns] = useState([
    {
      flex: 0.1,
      minWidth: 100,
      field: 'vehicle_id',
      headerName: 'Vehicle ID',
      renderCell: params => <Typography variant='body2'>{params.row.vehicle_id}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'vehicle_number',
      headerName: 'Vehicle Number',

      renderCell: params => <Typography variant='body2'>{params.row.vehicle_number}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'vehicle_status',
      headerName: 'Vehicle Status',

      renderCell: params => (
        <CustomChip
          label={params.row.vehicle_status}
          color={params.row.vehicle_status === 'Active' ? 'success' : 'error'}
        />
      )
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'actions',
      headerName: 'Actions',

      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Button variant='outlined' color='primary'>
              Track Location
            </Button>
          </Box>
        )
      }
    }
  ])

  const [vehicleNum, setVehicleNum] = useState('')
  const [vehicleNumerror, setVehicleNumError] = useState('')

  const [rowCount, setRowCount] = useState(3)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [openDialog, setOpenDialog] = useState(false)

  const handleCloseDialog = () => {
    setOpenDialog(false)
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
              <DataGrid
                autoHeight
                getRowHeight={() => 'auto'}
                getRowId={row => row.vehicle_id}
                rows={rows}
                rowCount={rowCount}
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
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Vehicle Type</InputLabel>
                <Select labelId='demo-simple-select-label' id='demo-simple-select' label='Vehicle type'>
                  <MenuItem value={10}>Tractor</MenuItem>
                  <MenuItem value={20}>Mini truck</MenuItem>
                  <MenuItem value={30}>Mini Lorry</MenuItem>
                  <MenuItem value={30}>Dimo Batta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={vehicleNum}
                id='outlined-basic'
                label='Vehicle Number'
                variant='outlined'
                fullWidth
                error={vehicleNumerror.length > 0}
                helperText={vehicleNumerror}
                onChange={e => {
                  const input = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') // Remove non-alphanumeric characters
                  let formattedInput = input.replace(/(\w{2,3})(\d{0,4})/, '$1-$2') // Add hyphen between characters and integers

                  const isValid = /^[A-Za-z]{2,3}-\d{4}$/.test(formattedInput) // Check validity

                  if (isValid) {
                    setVehicleNumError('')
                  } else {
                    setVehicleNumError('Invalid Vehicle Number')
                  }
                  setVehicleNum(formattedInput)
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Company Name</InputLabel>
                <Select labelId='demo-simple-select-label' id='demo-simple-select' label='Company Name'>
                  <MenuItem value={10}>Waste Wise</MenuItem>
                  <MenuItem value={20}>Kaduwela Municiple Council</MenuItem>
                  <MenuItem value={30}>Malabe Municiple Council</MenuItem>
                  <MenuItem value={30}>Kadawatha Municiple Council</MenuItem>
                  <MenuItem value={30}>Panadura Municiple Council</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField id='outlined-basic' label='Driver Name' variant='outlined' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id='outlined-basic' label='Helper Name' variant='outlined' fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' sx={{ px: 4 }}>
            Add Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ViewFleet