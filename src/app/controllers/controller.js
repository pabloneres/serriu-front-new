import api from "../services/api";

export function index(auth, params) {
  if (!auth) {
    return;
  }
  return api.get(`${params}`, {
    headers: {
      Authorization: "Bearer " + auth
    }
  });
}

export function show(auth, params, id) {
  if (!auth) {
    return;
  }
  return api.get(`${params}/${id}`, {
    headers: {
      Authorization: "Bearer " + auth
    }
  });
}

export function store(auth, params, data) {
  if (!auth) {
    return;
  }
  return api.post(params, data, {
    headers: {
      Authorization: "Bearer " + auth
    }
  });
}

export function update(auth, params, id, data) {
  if (!auth) {
    return;
  }
  return api.put(`${params}/${id}`, data, {
    headers: {
      Authorization: "Bearer " + auth
    }
  });
}

export function destroy(auth, params, id) {
  if (!auth) {
    return;
  }
  // Authorization head should be fulfilled in interceptor.
  return api.delete(`${params}/${id}`, {
    headers: {
      Authorization: "Bearer " + auth
    }
  });
}
