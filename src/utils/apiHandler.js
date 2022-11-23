import authHeader from "./authHeader";
import handleResponse from "./handleResponse";

async function get(requestURL, auth = true) {
  const requestOptions = {
    method: "GET",
  };
  if (auth) {
    const authHeaders = await authHeader();
    requestOptions.headers = authHeaders;
  }
  return fetch(requestURL, requestOptions).then((response)=>handleResponse(response, {...requestOptions, url: requestURL}));
}

async function post(requestURL, payload, auth = true, stringify = true) {
  const requestOptions = {
    method: "POST",
    body: stringify ? JSON.stringify(payload) : payload,
  };
  if (auth) {
    const authHeaders = await authHeader(stringify);
    requestOptions.headers = authHeaders;
  }
  return fetch(requestURL, requestOptions).then((response)=>handleResponse(response, {...requestOptions, url: requestURL}));
}

async function deleteRequest(requestURL, payload, auth = true) {
  const requestOptions = {
    method: "DELETE",
  };
  if (auth) {
    const authHeaders = await authHeader();
    requestOptions.headers = authHeaders;
  }
  return fetch(requestURL, requestOptions).then((response)=>handleResponse(response, {...requestOptions, url: requestURL}));
}

async function put(requestURL, payload, auth = true, stringify = true) {
  const requestOptions = {
    method: "PUT",
    body: stringify ? JSON.stringify(payload) : payload,
  };
  if (auth) {
    const authHeaders = await authHeader(stringify);
    requestOptions.headers = authHeaders;
  }
  return fetch(requestURL, requestOptions).then((response)=>handleResponse(response, {...requestOptions, url: requestURL}));
}

export default {
  get,
  post,
  deleteRequest,
  put,
};
