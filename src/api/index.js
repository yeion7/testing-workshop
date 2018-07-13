import { NotificationManager } from "react-notifications";
import qs from "qs";

const handleServerErrors = response => {
  if (response.ok) {
    return response.json();
  }
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
    default:
      break;
  }
};

const STAGING_API = "https://5b2affe83a8ea3001418d7fa.mockapi.io/api/v1/"

const request = (method, endpoint, query, body) => {
  const queryParsed = qs.stringify(query);
  const url = `${process.env.REACT_APP_API || STAGING_API}${endpoint}?${queryParsed}`;
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
  createUser(data) {
    return Post("/users", data);
  },

  getUsers(params) {
    return Get("/users", params);
  },

  getUser(id, params) {
    return Get(`/users/${id}`, params);
  },

  updateUser(id, data) {
    return Put(`/users/${id}`, data);
  },

  deleteUser(id) {
    return Delete(`/users/${id}`);
  }
};

export const Tweets = {
  createTweet(userId, data) {
    return Post(`/users/${userId}/tweets`, data);
  },

  getTweetsByUser(id, params) {
    return Get(`/users/${id}/tweets`, params);
  },

  getTweet(userId, tweetId, params) {
    return Get(`/users/${userId}/tweets/${tweetId}`, params);
  },

  updateTweet(userId, tweetId, data) {
    return Put(`/users/${userId}/tweets/${tweetId}`, data);
  },

  deleteTweet(userId, tweetId) {
    return Delete(`/users/${userId}/tweets/${tweetId}`);
  }
};

export default {
  Users,
  Tweets
};
