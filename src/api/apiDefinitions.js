import { api, auth } from './apiBase'

const apiDefinitions = {
  /* Auth APIs Start */

  login: async function (data) {
    return await auth.post(`api/v1/auth/login`, data)
  },

  refresh: async function (data) {
    return await auth.post(`api/v1/auth/refresh`, data)
  },

  /* Auth APIs End */
  /****************************************************************************/
  /* Branch APIs Start */

  getAllBranches: async function () {
    return await api.get(`api/v1/branches`)
  },

  getBranchById: async function (id) {
    return await api.get(`api/v1/branches/${id}`)
  },

  createBranch: async function (data) {
    return await api.post(`api/v1/branches/create`, data)
  },

  updateBranch: async function (id, data) {
    return await api.patch(`api/v1/branches/${id}`, data)
  },

  deleteBranch: async function (id) {
    return await api.delete(`api/v1/branches/${id}`)
  },

  addDriverToBranch: async function (id, data) {
    return await api.post(`api/v1/branches/${id}/drivers/create`, data)
  },

  addVehicleToBranch: async function (id, data) {
    return await api.post(`api/v1/branches/${id}/vehicles/create`, data)
  },

  getBranchByIdPopulated: async function (id) {
    return await api.get(`api/v1/branches/${id}/populate`)
  },

  getBranchDrivers: async function (id) {
    return await api.get(`api/v1/branches/${id}/drivers`)
  },

  getBranchVehicles: async function (id) {
    return await api.get(`api/v1/branches/${id}/vehicles`)
  },

  /* Branch APIs End */
  /****************************************************************************/
  /* Vehicle APIs Start */

  getAllVehicles: async function () {
    return await api.get(`api/v1/vehicles`)
  },

  getVehicleById: async function (id) {
    return await api.get(`api/v1/vehicles/${id}`)
  },

  createVehicle: async function (data) {
    return await api.post(`api/v1/vehicles/create`, data)
  },

  updateVehicle: async function (id, data) {
    return await api.patch(`api/v1/vehicles/${id}`, data)
  },

  deleteVehicle: async function (id) {
    return await api.delete(`api/v1/vehicles/${id}`)
  },

  /* Vehicle APIs End */
  /***************************************************************************/
  /* Driver APIs Start */

  getAllDrivers: async function () {
    return await api.get(`api/v1/drivers`)
  },

  getDriverById: async function (id) {
    return await api.get(`api/v1/drivers/${id}`)
  },

  createDriver: async function (data) {
    return await api.post(`api/v1/drivers/create`, data)
  },

  updateDriver: async function (id, data) {
    return await api.patch(`api/v1/drivers/${id}`, data)
  },

  deleteDriver: async function (id) {
    return await api.delete(`api/v1/drivers/${id}`)
  },

  /* Driver APIs End */
  /***************************************************************************/
  /* Schedule APIs Start */

  getAllSchedulesByBranch: async function (branchId) {
    return await api.get(`api/v1/branches/${branchId}/schedules`)
  },

  /* Schedule APIs End */
  /***************************************************************************/
  /* Route APIs Start */

  getAllRoutes: async function (branchId) {
    return await api.get(`api/v1/branches/${branchId}/routes`)
  },

  getRouteById: async function (branchId, routeId) {
    return await api.get(`api/v1/branches/${branchId}/routes/${routeId}`)
  },

  createRoute: async function (branchId, data) {
    return await api.post(`api/v1/branches/${branchId}/routes/create`, data)
  },

  updateRoute: async function (branchId, routeId, data) {
    return await api.patch(`api/v1/branches/${branchId}/routes/${routeId}`, data)
  },

  deleteRoute: async function (branchId, routeId) {
    return await api.delete(`api/v1/branches/${branchId}/routes/${routeId}`)
  }
}

export default apiDefinitions
