import api from '../services/api'

// DEFINIR AS ROTAS DAS CLINICAS
const INDEX_CLINICS_URL = "/procedimentos";

const INDEX_ESPECIALIDADE = "/especialidades";
const INDEX_PRECOS = "/precos";

const SHOW_CLINIC_URL = "/";

const STORE_CLINIC_URL = "/procedimento";

const UPDATE_CLINIC_URL = "/procedimento";

const DESTROY_CLINIC_URL = "/procedimento";

export function indexAll(authToken, id) {
  return api.get(`${INDEX_CLINICS_URL}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function index(authToken, id) {
  return api.get(`${INDEX_CLINICS_URL}/${id}`, {
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

export function indexEspecialidade(authToken) {
  return api.get(`${INDEX_ESPECIALIDADE}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function indexPrecos(authToken) {
  return api.get(`${INDEX_PRECOS}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

