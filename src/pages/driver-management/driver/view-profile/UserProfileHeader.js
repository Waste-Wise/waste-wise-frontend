// ** React Imports

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UserProfileHeader = () => {
  // ** State

  return (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image='/images/banners/profile-banner-1.jpg'
        sx={{
          height: 75
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -12,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <ProfilePicture src='/images/avatars/kaveeja.png' alt='profile-picture' />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'center',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h6' sx={{ mb: 0, fontSize: '1.375rem' }}>
              Kaveeja Perera
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  EMP002
                </Typography>
              </Box>
            </Box>
          </Box>
          <Chip
            label='ACTIVE'
            color='success'
            sx={{
              px: 10,
              py: 2,
              fontSize: '1rem',
              fontWeight: 600
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
