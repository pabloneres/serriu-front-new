import api from '../services/api'

let {user} = JSON.parse(localStorage.getItem('persist:v706-demo1-auth'))
let {authToken} = JSON.parse(user)

export function index(params, id) {
  return api.get(`${params}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function show(params, id) {
  return api.get(`${params}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function store(params, data) {
  return api.post(params, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function update(params, id, data) {
  return api.put(`${params}/${id}`, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function destroy(params, id) {
  // Authorization head should be fulfilled in interceptor.
  return api.delete(`${params}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}
