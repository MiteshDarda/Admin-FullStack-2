import axios from "axios";

const deleteUserFromTask = async (token, userId) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks/user/${userId}`,
    headers: {
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

export default deleteUserFromTask;
