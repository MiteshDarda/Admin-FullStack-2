import axios from "axios";

const getUsers = async (token, limit, page) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/users/all?limit=${limit}&page=${page}`,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.request(config);
    // console.log(response);
    return response;
  } catch (e) {
    console.log(e);
    return e.response;
  }
};

export default getUsers;
