// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { Icon, } from '@iconify/react'

import Link from 'next/link'

import { styled } from '@mui/material/styles'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rows } from '../../@fake-db/mock-data/schedules'

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

const ManageSchedule = () => {
  // const [rows, setRows] = useState([])

  const [columns, setColumns] = useState([
    {
      flex: 0.1,
      minWidth: 100,
      field: 'schedule_id',
      headerName: 'Schedule ID',
      renderCell: params => <Typography variant='body2'>{params.row.schedule_id}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'schedule_name',
      headerName: 'Schedule Name',

      renderCell: params => <Typography variant='body2'>{params.row.schedule_name}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'schedule_status',
      headerName: 'Schedule Status',

      renderCell: params => (
        <CustomChip
          label={params.row.schedule_status}
          color={params.row.schedule_status === 'Active' ? 'success' : 'error'}
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
              View Schedule
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
          <Typography variant='h5'>Manage Schedules</Typography>
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
                  Add Schedule
                </Button>
              }
            />
            <CardContent>
              <DataGrid
                autoHeight
                getRowHeight={() => 'auto'}
                getRowId={row => row.schedule_id}
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
          Add New Schedule
          <CustomCloseButton aria-label='close' onClick={handleCloseDialog}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent
          sx={{
            width: '600px'
          }}
        >
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' sx={{ px: 4 }}>
            Add Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ManageSchedule
