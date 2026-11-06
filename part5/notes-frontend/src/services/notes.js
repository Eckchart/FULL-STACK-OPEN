import axios from 'axios'

const baseUrl = '/api/notes'
let token = null

const getAll = () => {
  // const request = axios.get(baseUrl)
  // const nonExisting = {
  //   id: 10000,
  //   content: 'This note is not saved to server',
  //   important: true
  // }
  return axios.get(baseUrl).then(response => response.data)
  // return request.then(response => response.data.concat(nonExisting))
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const create = async (newObject) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, create, update, remove, setToken }
