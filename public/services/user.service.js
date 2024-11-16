export const userService = {
    query,
    login,
    logout,
    signup,
    remove,
    getById,
    getLoggedInUser,
    getEmptyCredentials
  }
  
  const STORAGE_KEY = 'loggedinUser'
  const BASE_URL = '/api/auth/'
  
  function query() {
    return axios.get('/api/user').then(res => res.data)
  }
  
  function login(credentials) {
    console.log('credentials', credentials)
    return axios
      .post(BASE_URL + 'login', credentials)
      .then(res => res.data)
      .then(user => {
        console.log('user', user)
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        return user
      })
  }
  
  function signup(signupInfo) {
    return axios
      .post(BASE_URL + 'signup', signupInfo)
      .then(res => res.data)
      .then(user => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        return user
      })
  }
  
  function remove(userId) {
    console.log(userId)
    return axios.delete('/api/user/' + userId)
  }
  
  function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    return axios.post(BASE_URL + 'logout')
  }
  
  function getById(userId) {
    return axios
      .get('/api/user/' + userId)
      .then(res => res.data)
      .catch(err => console.log(err))
  }
  
  function getEmptyCredentials() {
    return {
      username: '',
      password: ''
    }
  }
  
  function getLoggedInUser() {
    return _getUserFromSession()
  }
  
  function _getUserFromSession() {
    const entity = sessionStorage.getItem(STORAGE_KEY)
    return JSON.parse(entity)
  }
  