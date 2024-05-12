import axios from "axios";

const deleteUser = async (token, user, setSeverity, setAlertMessage) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/users/${user}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.request(config);
    return response;
  } catch (e) {
    console.log(e);
    setSeverity("error");
    setAlertMessage("Something went wrong. Try refreshing the page.");
    return e.response;
  }
};

export default deleteUser;
