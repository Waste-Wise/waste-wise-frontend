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
      path: '/route-management',
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
          title: 'Track Fleet',
          path: '/fleet-management/track-fleet'
        },
        {
          title: 'View Fleet',
          path: '/fleet-management/view-fleet'
        }
      ]
    }
  ]
}

export default navigation
