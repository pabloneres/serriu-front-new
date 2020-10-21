import api from '../services/api'

// DEFINIR AS ROTAS DAS CLINICAS
const INDEX_CLINICS_URL = "/orcamentos";

const GET_ORCAMENTOS_URL = "/list_orcamentos";

const GET_PROCEDIMENTOS_URL = "/procedimento";

const SHOW_CLINIC_URL = "/orcamento";

const STORE_CLINIC_URL = "/orcamento";

const UPDATE_CLINIC_URL = "/orcamento";

const DESTROY_CLINIC_URL = "/orcamento";

export function index(authToken) {
  return api.get(`${INDEX_CLINICS_URL}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function getProcedimentos(authToken, id) {
  return api.get(`${GET_PROCEDIMENTOS_URL}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function orcamento(authToken, id) {
  return api.get(`${GET_ORCAMENTOS_URL}/${id}`, {
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