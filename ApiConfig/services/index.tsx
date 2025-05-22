import axios from "axios";
import Apiconfigs from "../ApiConfig";

// import CryptoJS from "crypto-js";

export const apiRouterCall = async ({
  method,
  id,
  endPoint,
  data,
  params,
  token,
  source,
  url,
  multId,
  multId2,
}) => {
  try {
    return axios({
      method: method,
      url: url
        ? url
        : id
        ? `${Apiconfigs[endPoint]}/${id}`
        : multId
        ? `${Apiconfigs[endPoint]}/${multId}/${multId2}`
        : Apiconfigs[endPoint],
      headers: {
        token: token ? token : window.sessionStorage.getItem("explorerToken"),
      },
      data: data ? data : null,
      params: params ? params : null,
      cancelToken: source ? source.token : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};
