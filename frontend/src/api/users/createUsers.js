import axios from "axios";

const createUsers = async (
  name,
  email,
  password,
  designation,
  token,
  setSeverity,
  setAlertMessage,
) => {
  let data = JSON.stringify({
    name,
    email,
    password,
    designation,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/users/create`,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    if (response.status === 201) {
      return response;
    }
  } catch (e) {
    console.log(e);
    setSeverity("warning");
    setAlertMessage("Server Error");
    console.log("here");

    return e.response;
  }
};

export default createUsers;
