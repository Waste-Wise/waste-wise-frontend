// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
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

const ManageRoutes = () => {
  // const [rows, setRows] = useState([])

  const [columns, setColumns] = useState([
    {
      flex: 0.1,
      minWidth: 100,
      field: 'route_id',
      headerName: 'Route ID',
      renderCell: params => <Typography variant='body2'>{params.row.route_id}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'route_name',
      headerName: 'Route Name',

      renderCell: params => <Typography variant='body2'>{params.row.route_name}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'route_start',
      headerName: 'Start',

      renderCell: params => <Typography variant='body2'>{params.row.route_start}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'route_end',
      headerName: 'End',

      renderCell: params => <Typography variant='body2'>{params.row.route_end}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'route_distance',
      headerName: 'Distance',

      renderCell: params => <Typography variant='body2'>{params.row.route_distance}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'route_duration',
      headerName: 'Duration',

      renderCell: params => <Typography variant='body2'>{params.row.route_duration}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'route_status',
      headerName: 'Status',

      renderCell: params => (
        <CustomChip
          label={params.row.route_status}
          color={params.row.route_status === 'Active' ? 'success' : 'error'}
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
              View Route
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

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Manage Routes</Typography>
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
                  Add Route
                </Button>
              }
            />
            <CardContent>
              <DataGrid
                autoHeight
                getRowHeight={() => 'auto'}
                getRowId={row => row.route_id}
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
          Add New Route
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
            <Grid item xs={12}>
              <TextField id='outlined-basic' label='Route Name' variant='outlined' fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField id='outlined-basic' label='Route Start' variant='outlined' fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField id='outlined-basic' label='Route End' variant='outlined' fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='outlined-basic'
                label='Distance'
                type='number'
                variant='outlined'
                fullWidth
                InputProps={{
                  endAdornment: 'KM'
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='outlined-basic'
                label='Duration'
                type='number'
                variant='outlined'
                fullWidth
                InputProps={{
                  endAdornment: 'Hours'
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' sx={{ px: 4 }}>
            Add Route
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ManageRoutes
