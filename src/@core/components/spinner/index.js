// // ** MUI Imports
// import { useTheme } from '@mui/material/styles'
// import Box from '@mui/material/Box'
// import CircularProgress from '@mui/material/CircularProgress'
// import Typography from '@mui/material/Typography'

// const FallbackSpinner = ({ sx }) => {
//   // ** Hook
//   const theme = useTheme()

//   return (
//     <Box
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         ...sx
//       }}
//     >
//       <Box
//         sx={{
//           transform: 'rotate(180deg)'
//         }}
//       >
//         <svg width={120} fill='none' height={66} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
//           <rect
//             rx='25.1443'
//             width='50.2886'
//             height='143.953'
//             fill={theme.palette.primary.main}
//             transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
//           />
//           <rect
//             rx='25.1443'
//             width='50.2886'
//             height='143.953'
//             fillOpacity='0.4'
//             fill='url(#paint0_linear_7821_79167)'
//             transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
//           />
//           <rect
//             rx='25.1443'
//             width='50.2886'
//             height='143.953'
//             fill={theme.palette.primary.main}
//             transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
//           />
//           <rect
//             rx='25.1443'
//             width='50.2886'
//             height='143.953'
//             fill={theme.palette.primary.main}
//             transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
//           />
//           <rect
//             rx='25.1443'
//             width='50.2886'
//             height='143.953'
//             fillOpacity='0.4'
//             fill='url(#paint1_linear_7821_79167)'
//             transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
//           />
//           <rect
//             rx='25.1443'
//             width='50.2886'
//             height='143.953'
//             fill={theme.palette.primary.main}
//             transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
//           />
//           <defs>
//             <linearGradient
//               y1='0'
//               x1='25.1443'
//               x2='25.1443'
//               y2='143.953'
//               id='paint0_linear_7821_79167'
//               gradientUnits='userSpaceOnUse'
//             >
//               <stop />
//               <stop offset='1' stopOpacity='0' />
//             </linearGradient>
//             <linearGradient
//               y1='0'
//               x1='25.1443'
//               x2='25.1443'
//               y2='143.953'
//               id='paint1_linear_7821_79167'
//               gradientUnits='userSpaceOnUse'
//             >
//               <stop />
//               <stop offset='1' stopOpacity='0' />
//             </linearGradient>
//           </defs>
//         </svg>
//       </Box>
//       <Typography variant='h3' sx={{ mt: 3 }}>
//         WasteWise
//       </Typography>
//       <CircularProgress disableShrink sx={{ mt: 6 }} />
//     </Box>
//   )
// }

// export default FallbackSpinner

import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()
  const [showRefresh, setShowRefresh] = useState(false)

  useEffect(() => {
    // Set a timer to show the refresh option after 10 seconds
    const timer = setTimeout(() => {
      setShowRefresh(true)
    }, 10000)

    // Clear the timer on component unmount
    return () => clearTimeout(timer)
  }, [])

  // Function to refresh the page
  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Box
        sx={{
          transform: 'rotate(180deg)'
        }}
      >
        {/* Your SVG code here */}
      </Box>
      <Typography variant='h3' sx={{ mt: 3 }}>
        WasteWise
      </Typography>
      <CircularProgress disableShrink sx={{ mt: 6 }} />
      {showRefresh && (
        <Typography
          variant='body1'
          sx={{ mt: 2, cursor: 'pointer', textDecoration: 'underline' }}
          onClick={refreshPage}
        >
          If loading takes too long, <b>click here to refresh</b>.
        </Typography>
      )}
    </Box>
  )
}

export default FallbackSpinner
