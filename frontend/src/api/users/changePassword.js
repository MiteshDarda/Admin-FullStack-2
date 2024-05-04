import axios from "axios";

export const changePassword = async (data, token) => {
  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/users/password`,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
