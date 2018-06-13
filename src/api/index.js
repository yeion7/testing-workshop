import { NotificationManager } from "react-notifications";
import queryString from "query-string";

const API_URL = "https://5b1b2fcf6e0fd400146aaefc.mockapi.io/api/v1";

const handleServerErrors = response => {
  if (response.ok && response.status === 200) return response.json();
  switch (response.status) {
    case 403:
      NotificationManager.error("Acceso denegado");
      break;
    case 404:
      NotificationManager.error("No se ha encontrado el elemento");
      break;
    case 401:
      NotificationManager.error("Autenticate para poder acceder");
      break;
    case 500:
      NotificationManager.error("Ha ocurrido un error con el servidor");
      break;
  }
};

const request = (method, endpoint, query, body) => {
  const queryParsed = queryString.stringify(query);
  const url = `${API_URL}${endpoint}?${queryParsed}`;
  const params = {
    method,
    headers: {
      "content-type": "application/json"
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  return fetch(url, params)
    .then(handleServerErrors)
    .catch(NotificationManager.error);
};

// HTTP GET
function Get(route, params = {}) {
  return request("GET", route, params, null);
}
// HTTP POST
function Post(route, body = null) {
  return request("POST", route, {}, body);
}
// HTTP PUT
function Put(route, body = null) {
  return request("PUT", route, {}, body);
}
// HTTP DELETE
function Delete(route, params = {}) {
  return request("DELETE", route, params, null);
}

export const Users = {
  getUsers(params) {
    return Get("/users", params);
  },

  deleteUser(id) {
    return Delete(`/users/${id}`);
  }
};

export default {
  Users
};
