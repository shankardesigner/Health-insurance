const handleResponse = (response, requestOptions) => {
  // return authorization header with jwt token
  return response
    .text()
    .then((text) => {
      // const data = text && JSON.parse(text);
      let data;
      if(text===''){
        text = JSON.stringify({});
      }
      try {
        data = text && JSON.parse(text);
        data.status = response.status;
        data.requestOptions = requestOptions;
      } catch (error) {
        return 'error';
      }
      if (!response.ok) {
        if (response.status === 401) {
          // auto logout if 401 response returned from api
          // logout();
          // location.reload(true); // eslint-disable-line no-restricted-globals
        }
        if (response.status === 500) {
          return Promise.reject('error');
        }

        //   const error = (data && data.message) || response.statusText;
        const error = { ...data, status: response.status };

        // eslint-disable-next-line promise/no-return-wrap
        return Promise.reject(error);
      }
      return data;
    })
    .catch((error) => {
      return error;
    });
};

export default handleResponse;
