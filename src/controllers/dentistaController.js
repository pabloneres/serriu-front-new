import api from '../services/api'

// DEFINIR AS ROTAS DAS CLINICAS
const INDEX_CLINICS_URL = "/dentists";

const SHOW_CLINIC_URL = "/dentist";

const STORE_CLINIC_URL = "/register/dentist";

const UPDATE_CLINIC_URL = "/dentist";

const DESTROY_CLINIC_URL = "/dentist";

export function index(authToken) {
  return api.get(`${INDEX_CLINICS_URL}`, {
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