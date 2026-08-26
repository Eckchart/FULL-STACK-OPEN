import axios from "axios"

// PERSONS IN THE BACKEND = NUMBERS IN THE HTML PAGE BASICALLY,,,
const baseUrl = 'http://localhost:3003/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

export default { getAll, create, update }
