import axios from 'axios';

const defaults = {
  statusCodes: [403]
};

// Логика обновлшения токена
const refreshAuthLogic = failedRequest => {
  return axios
    .get('/api/refresh', {
      headers: { 'x-auth-refresh-token': localStorage.refreshToken }
    })
    .then(tokenRefreshResponse => {
      localStorage.setItem(
        'accessToken',
        tokenRefreshResponse.data.tokens.accessToken
      );
      localStorage.setItem(
        'refreshToken',
        tokenRefreshResponse.data.tokens.refreshToken
      );
      failedRequest.response.config.headers['x-auth-token'] =
        tokenRefreshResponse.data.tokens.accessToken;
      return Promise.resolve();
    });
};

const createRefreshInterceptor = (axios, refreshTokenCall, options = {}) => {
  const id = axios.interceptors.response.use(
    res => res,
    error => {
      // Reject promise if the error status is not in options.ports or defaults.ports
      const statusCodes =
        options.hasOwnProperty('statusCodes') && options.statusCodes.length
          ? options.statusCodes
          : defaults.statusCodes;
      if (
        !localStorage.refreshToken ||
        !error.response ||
        (error.response.status &&
          statusCodes.indexOf(+error.response.status) === -1)
      ) {
        return Promise.reject(error);
      }

      // Remove the interceptor to prevent a loop
      // in case token refresh also causes the 403
      axios.interceptors.response.eject(id);

      const refreshCall = refreshTokenCall(error);

      // Create interceptor that will bind all the others requests
      // until refreshTokenCall is resolved
      const requestQueueInterceptorId = axios.interceptors.request.use(
        request => refreshCall.then(() => request)
      );

      // When response code is 403 (Unauthorized), try to refresh the token.
      return refreshCall
        .then(() => {
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return axios(error.response.config);
        })
        .catch(error => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return Promise.reject(error);
        })
        .finally(() =>
          createRefreshInterceptor(axios, refreshTokenCall, options)
        );
    }
  );
  return axios;
};

const createSetAuthInterceptor = options => config => {
  if (localStorage.accessToken) {
    config.headers['x-auth-token'] = localStorage.accessToken;
  } else {
    delete config.headers['x-auth-token'];
  }
  return config;
};

const setInterceptors = () => {
  createRefreshInterceptor(axios, refreshAuthLogic).interceptors.request.use(
    createSetAuthInterceptor({})
  );
};

export default setInterceptors;
