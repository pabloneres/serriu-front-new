import api from '../../../services/api'

export const LOGIN_URL = "/sessions";
export const REGISTER_URL = "/register";
export const REQUEST_PASSWORD_URL = "/password/forgot";
export const RESET_PASSWORD_URL = "/password/reset";

export const ME_URL = "/profile";

let token = undefined

export async function login(username, password) {
  const _req = await api.post(LOGIN_URL, { username, password });
  token =  await _req.data.token
  return _req
}

export function register(name, email, password) {
  return api.post(REGISTER_URL, { username: name, email, password });
}

export function requestPassword(email) {
  return api.post(REQUEST_PASSWORD_URL, { email });
}

export async function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return api.get(ME_URL, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
}

export function reset(token, password, password_confirmation) {
  return api.post(RESET_PASSWORD_URL, { token, password, password_confirmation });
}