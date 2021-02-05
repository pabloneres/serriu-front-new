import api from "../services/api";

let { user } = JSON.parse(localStorage.getItem("persist:v706-demo1-auth"));
let { authToken } = JSON.parse(user);

export function index(params) {
  if (!authToken) {
    return;
  }
  return api.get(`${params}`, {
    headers: {
      Authorization: "Bearer " + authToken
    }
  });
}

export function show(params, id) {
  if (!authToken) {
    return;
  }
  return api.get(`${params}/${id}`, {
    headers: {
      Authorization: "Bearer " + authToken
    }
  });
}

export function store(params, data) {
  if (!authToken) {
    return;
  }
  return api.post(params, data, {
    headers: {
      Authorization: "Bearer " + authToken
    }
  });
}

export function update(params, id, data) {
  if (!authToken) {
    return;
  }
  return api.put(`${params}/${id}`, data, {
    headers: {
      Authorization: "Bearer " + authToken
    }
  });
}

export function destroy(params, id) {
  if (!authToken) {
    return;
  }
  // Authorization head should be fulfilled in interceptor.
  return api.delete(`${params}/${id}`, {
    headers: {
      Authorization: "Bearer " + authToken
    }
  });
}
