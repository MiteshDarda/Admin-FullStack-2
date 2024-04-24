import axios from "axios";
export const getBankDetails = async (token) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/users/details`,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      Authorization: `Bearer ${token}`,
    },
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.request(config);
    return response;
  } catch (e) {
    return e.response;
  }
};

export const patchBankDetails = async (data, token) => {
  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/users/details`,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      return response;
    }
  } catch (e) {
    return e.response;
  }
};
