// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import { Icon } from '@iconify/react'

import Link from 'next/link'

import { styled } from '@mui/material/styles'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rows } from './static-data'
import { set } from 'nprogress'

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
  if (row.avatar.length) {
    return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
        {getInitials(row.full_name ? row.full_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const ManageDrivers = () => {
  // const [rows, setRows] = useState([])

  const [columns, setColumns] = useState([
    {
      flex: 0.275,
      minWidth: 290,
      field: 'full_name',
      headerName: 'Name',

      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.full_name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      type: 'vehicle',
      minWidth: 120,
      headerName: 'Vehicle',
      field: 'vehicle',

      valueGetter: params => new Date(params.value),
      renderCell: params => (
        <Typography variant='body2'>
          <LinkStyled href='/'>{params.row.vehicle}</LinkStyled>
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'route',
      headerName: 'Route',

      renderCell: params => (
        <Typography variant='body2'>
          <LinkStyled href='/'>{params.row.route}</LinkStyled>
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
            <Button variant='outlined' color='primary'>
              View Profile
            </Button>
          </Box>
        )
      }
    }
  ])

  const [rowCount, setRowCount] = useState(3)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [openDialog, setOpenDialog] = useState(false)

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumberError, setPhoneNumberError] = useState('')

  const handlePhoneNumberChange = value => {
    const input = value.slice(0, 9)
    setPhoneNumberError('')
    setPhoneNumber(input)

    const firstDigit = input.charAt(0)

    if (firstDigit === '7') {
      if (input !== '') {
        if (input.length < 9) {
          setPhoneNumberError('Phone number must be 9 digits')
        } else {
          setPhoneNumberError('')
        }
      } else {
        setPhoneNumberError('')
      }
    } else {
      setPhoneNumberError('Invalid phone number')
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
              <DataGrid
                autoHeight
                getRowHeight={() => 'auto'}
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
          <Grid container spacing={6} sx={{ pt: 3 }}>
            <Grid item xs={12}>
              <TextField id='outlined-basic' label='Driver Name' variant='outlined' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField id='outlined-basic' label='Driver Email' variant='outlined' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='outlined-basic'
                label='Driver Phone Number'
                variant='outlined'
                fullWidth
                type='number'
                placeholder='7xxxxxxxx'
                value={phoneNumber}
                onChange={e => handlePhoneNumberChange(e.target.value)}
                error={phoneNumberError.length > 0}
                helperText={phoneNumberError}
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1 }}>+94</Box>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField id='outlined-basic' label='Driver NIC' variant='outlined' fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' sx={{ px: 4 }}>
            Add Driver
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ManageDrivers
