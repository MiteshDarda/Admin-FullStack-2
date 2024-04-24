import axios from "axios";

const assignUser = async (
  token,
  taskId,
  currency,
  price,
  assignedRole,
  assignedTo,
) => {
  let data = JSON.stringify({
    currency,
    price,
    assignedRole,
    assignedTo,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks/${taskId}/user`,
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

export default assignUser;
