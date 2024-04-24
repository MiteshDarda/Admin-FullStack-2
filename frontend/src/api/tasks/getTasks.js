import axios from "axios";

const getTasks = async (token, limit, page) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks?limit=${limit}&page=${page}`,
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

export default getTasks;
