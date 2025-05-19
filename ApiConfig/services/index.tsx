import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const url: string = "https://apikyctestnet.tanscan.com/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // try {

  //   if (token) {
  //     if (config.headers instanceof AxiosHeaders) {
  //     } else {
  //       config.headers = new AxiosHeaders({
  //         token: token,
  //         deviceType: Platform.OS,
  //       });
  //     }
  //   }
  // } catch (error) {
  //   console.error("Error retrieving access token:", error);
  // }

  return config;
});

// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error) => {
//     if (error?.response?.data?.responseCode == 440) {
//       ToastAndroid.show(
//         error?.response?.data?.responseMessage,
//         ToastAndroid.SHORT
//       );
//       AsyncStorage.removeItem("access_token");
//       TokenService.setToken(null);
//       if (router.canGoBack()) {
//         router.dismissAll();
//         router.replace("/auth/login-screen");
//       } else {
//         router.replace("/auth/login-screen");
//       }
//     }

//     return Promise.reject(error);
//   }
// );
