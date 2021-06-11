import api from '../services/api'

// DEFINIR AS ROTAS DAS CLINICAS
const INDEX_CLINICS_URL = "/users";

const SHOW_CLINIC_URL = "/clinic";

const STORE_CLINIC_URL = "/register/clinic";

const STORE_CLINIC_INFOS = "/clinic";

const UPDATE_CLINIC_URL = "/clinic";

const DESTROY_CLINIC_URL = "/user";

export function index(authToken) {
  return api.get(`${INDEX_CLINICS_URL}/clinics`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function show(authToken, id) {
  return api.get(`${SHOW_CLINIC_URL}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function store(authToken, data) {
  return api.post(STORE_CLINIC_URL, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function register(authToken, data) {
  return api.post(STORE_CLINIC_INFOS, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function update(authToken, id, data) {
  return api.put(`${UPDATE_CLINIC_URL}/${id}`, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function destroy(authToken, id) {
  // Authorization head should be fulfilled in interceptor.
  return api.delete(`${DESTROY_CLINIC_URL}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}