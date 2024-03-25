// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
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
  FormControl,
  FormHelperText
} from '@mui/material'
import { Icon } from '@iconify/react'

import Link from 'next/link'

import { styled } from '@mui/material/styles'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rowData } from './static-data'

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
    setRows(rowData)
    setRowCount(rowData.length)
  }, [])

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
        id: rowCount + 1,
        vehicle_number: vehicleNum,
        vehicle_status: 'Inactive',
        vehicle_type: vehicleType
      }

      setRows([...rows, newVehicle])
      setRowCount(rowCount + 1)

      handleCloseDialog()
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
