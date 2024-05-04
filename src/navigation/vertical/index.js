const navigation = () => {
  return [
    {
      title: 'Dashboard',
      path: '/home',
      icon: 'mdi:view-dashboard-outline'
    },

    // {
    //   title: 'Collection Schedule',
    //   path: '/schedule-management',
    //   icon: 'healthicons:i-schedule-school-date-time'
    // },
    {
      title: 'Manage Route',
      path: '/route-management',
      icon: 'eos-icons:route'
    },
    {
      title: 'Drivers',
      path: '/driver-management',
      icon: 'mdi:drivers-license-outline'
    },
    {
      title: 'Fleet',
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
