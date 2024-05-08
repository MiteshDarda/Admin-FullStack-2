import axios from "axios";

const approveUserTask = async (
  token,
  delivery,
  quality,
  communication,
  userId,
  feedback
) => {
  let data = JSON.stringify({
    delivery,
    quality,
    communication,
    feedback
  });

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks/user/${userId}/complete`,
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
    console.log(e);
    return e.response;
  }
};

export default approveUserTask;
