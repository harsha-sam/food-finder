import axios from "axios";

export const axiosInstance = axios.create();
// Add a request interceptor and store access token within the request
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access-token');
  const refreshToken = localStorage.getItem('refresh-token');
  if (accessToken) config.headers['access-token'] = accessToken;
  if (refreshToken) config.headers['refresh-token'] = refreshToken;
  return config;
},
  (error) => {
    Promise.reject(error);
  }
);

// refreshing access token with refresh token when request failed
axiosInstance.interceptors.response.use(
  (response) => response,
  (err) => {
    const request = err.config;
    const refreshToken = localStorage.getItem('refresh-token');
    // if request failed with 401, try fetching new access token and again make the request
    if (refreshToken &&
      err.response.status === 401 &&
      !request._retry
    ) {
      request._retry = true;
      return axios.get(`/api/auth/token`, {
        headers: {
          'refresh-token': refreshToken
        }
      })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("access-token", res.data.accessToken);
            // console.log("access token is refreshed")
            return axiosInstance(request);
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        })
    }
    return Promise.reject(err);
  }
)