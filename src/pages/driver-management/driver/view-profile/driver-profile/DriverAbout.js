import React from 'react'
import { Box, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

const DriverAbout = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 400px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space - between'
      }}
    >
      <Typography variant='body1' sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
        About
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          minHeight: 'calc(100vh - 470px)',
          my: 5
        }}
      >
        <Box
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' },
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Icon icon='mdi:user' fontSize={20} />
          </Box>

          <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Name:
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Kaveeja Perera
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' },
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Icon icon='clarity:id-badge-solid' fontSize={20} />
          </Box>

          <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Employee ID:
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              EMP002
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' },
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Icon icon='material-symbols:id-card-outline' fontSize={20} />
          </Box>

          <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
              NIC:
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              123456789V
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' },
            alignItems: 'flex-start'
          }}
        >
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Icon icon='entypo:email' fontSize={20} />
          </Box>

          <Box
            sx={{
              columnGap: 2,
              display: 'flex',
              flexDirection: 'row',

              alignItems: 'flex-start'
            }}
          >
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Email:
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              kaveeja@wastewise.com
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' },
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Icon icon='fluent:call-24-filled' fontSize={20} />
          </Box>

          <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Phone:
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              0771234567
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DriverAbout
