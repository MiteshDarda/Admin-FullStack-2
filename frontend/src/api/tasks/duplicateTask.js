import axios from "axios";

const duplicateTask = async (token, numberOfDuplicates,id) => {
  let data = JSON.stringify({
    numberOfDuplicates: numberOfDuplicates,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks/duplicate/${id}`,
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

export default duplicateTask;
