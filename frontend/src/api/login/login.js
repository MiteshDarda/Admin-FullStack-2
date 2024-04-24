import axios from "axios";
export const loginAPI = async (url, email, password) => {
  let data = JSON.stringify({
    email: email,
    password: password,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response;
  } catch (e) {
    return e.response;
  }
};

export const getMyDetails = async (token) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/users/me`,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.request(config);
    if (response.status === 200) return response;
  } catch (e) {
    console.log(e);
    return e.response;
  }
};
