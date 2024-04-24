import axios from 'axios';
const setTaskToCompleted = async(token,taskId) => {



  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/tasks/${taskId}/complete`,
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning",
      "Content-Type": "application/json",
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
}

export default setTaskToCompleted