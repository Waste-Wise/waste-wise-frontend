// ** MUI Imports
import { Icon } from '@iconify/react'
import { Box, Button } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import { useRouter } from 'next/router'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'


// ** Data Import
import { rows } from '../../@fake-db/mock-data/schedules'

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

  const router = useRouter()
  const [rowCount, setRowCount] = useState(3)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

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
                    router.push(`/schedule-management/add-new-schedule`)
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
    </>
  )
}

export default ManageSchedule
