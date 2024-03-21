const navigation = () => {
  return [
    {
      title: 'Dashboard',
      path: '/home',
      icon: 'mdi:view-dashboard-outline'
    },
    {
      title: 'Collection Schedule',
      path: '/',
      icon: 'healthicons:i-schedule-school-date-time'
    },
    {
      title: 'Routes',
      path: '/',
      icon: 'eos-icons:route'
    },
    {
      title: 'Manage Drivers',
      path: '/driver-management',
      icon: 'mdi:drivers-license-outline'
    },
    {
      title: 'Manage Fleet',
      icon: 'mdi:truck-outline',
      children: [
        {
          title: 'Vehicles',
          path: '/'
        },
        {
          title: 'Vehicle Types',
          path: '/'
        },
        {
          title: 'Vehicle Makes',
          path: '/'
        },
        {
          title: 'Vehicle Models',
          path: '/'
        }
      ]
    }
  ]
}

export default navigation
