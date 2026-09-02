import axios from "axios"

// PERSONS IN THE BACKEND = NUMBERS IN THE HTML PAGE BASICALLY,,,
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
  // it returns the updated person object from the server
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

const destroy = (id) => {
  // it returns the deleted object
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

export default { getAll, create, update, destroy }
