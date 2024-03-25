import React from 'react'
import { useRouter } from 'next/router'

const DriverProfile = () => {
  const router = useRouter()

  const driverId = router.query.id

  return <div>
    <h1>Driver Profile</h1>
    <p>Driver ID: {driverId}</p>
  </div>
}

export default DriverProfile
