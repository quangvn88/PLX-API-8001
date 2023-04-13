const axios = require("axios");
const env = {
  API_TIMEOUT: 3000,
  BASE_URL: "", //
};

// https://github.com/axios/axios#creating-an-instance
const instance = axios.create({
  baseURL: env.BASE_URL,
  timeout: Number(env.API_TIMEOUT),
});

/**
 * Catch axios timeout
 */
const axiosCatchTimeout = (config) => {
  // handler timeout manually
  const _timeoutConfig = instance.defaults.timeout;
  if (_timeoutConfig) {
    let cancel;
    config.cancelToken = new axios.CancelToken((cancelToken) => {
      cancel = cancelToken;
    });
    config.cancelTimeout = setTimeout(() => {
      cancel(
        JSON.stringify({
          message: `timeout of ${_timeoutConfig}ms exceeded`,
        })
      );
    }, _timeoutConfig);
  }
};

/**
 * Before request interceptor
 */
instance.interceptors.request.use((config) => {
  // handler timeout manually
  axiosCatchTimeout(config);
  return config;
});

/**
 * Before response interceptor
 */
instance.interceptors.response.use(
  (response) => {
    if (response.config.cancelTimeout) {
      clearTimeout(response.config.cancelTimeout);
    }
    return response;
  },
  (error) => {
    // error logger
    // console.log({ error });

    if (axios.isCancel(error)) {
      error = JSON.parse(error.message);
    } else {
      if (error.config.cancelTimeout) {
        clearTimeout(error.config.cancelTimeout);
      }
    }
    throw error;
  }
);

module.exports = instance;
