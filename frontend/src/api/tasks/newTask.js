import axios from "axios";

const newTask = async (token, title, description, estimatedCompletion) => {
  let data = JSON.stringify({
    title,
    description,
    estimatedCompletion,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks`,
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

export default newTask;
