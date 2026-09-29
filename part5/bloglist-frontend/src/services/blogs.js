import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = newToken
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlogObj) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(baseUrl, newBlogObj, config)
  return response.data
}

const update = async (updatedBlogObj) => {
  const response = await axios.put(
    `${baseUrl}/${updatedBlogObj.id}`,
    updatedBlogObj
  )
  return response.data
}

const destroy = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}


export default { getAll, setToken, create, update, destroy }
