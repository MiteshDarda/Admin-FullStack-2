import axios from "axios";

const getReceipts = async (token, email, query, month, year) => {
  let data = JSON.stringify({
    taskIdOrTitle: query,
    month: `${month}`,
    year: `${year}`,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_URL}/payout/${email}`,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip-browser-warning",
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

export default getReceipts;
