import axios from "axios";

const editTask = async (
  token,
  title,
  description,
  estimatedCompletion,
  taskId,
) => {
  let data = JSON.stringify({
    title,
    description,
    estimatedCompletion,
  });

  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks/${taskId}`,
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

export default editTask;
