import axios from "axios";

const searchUser = async (token, limit, page, query) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/users/search?limit=${limit}&page=${page}&searchBy=${query}`,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.request(config);
    return response;
  } catch (e) {
    console.log(e);
    return e.response;
  }
};

export default searchUser;
