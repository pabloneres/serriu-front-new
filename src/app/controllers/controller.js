import api from '../services/api'


export function index(params, authToken ) {
  return api.get(`${params}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function show(authToken, params, id ) {
  return api.get(`${params}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function store(authToken, params, data) {
  return api.post(params, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function update(params, id, data, authToken) {
  return api.put(`${params}/${id}`, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function destroy(authToken, params, id) {
  // Authorization head should be fulfilled in interceptor.
  return api.delete(`${params}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}
