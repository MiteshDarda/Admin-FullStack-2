import axios from "axios";

const deleteTask = async (
  token,
  taskId,
) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks/${taskId}`,
    headers: {
      Authorization:
        `Bearer ${token}`,
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

export default deleteTask;
