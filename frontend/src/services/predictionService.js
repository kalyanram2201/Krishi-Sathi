import axios from "axios";

const API_URL =
  "http://localhost:5000/predictions";

export const getPredictions = async () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  return response.data;
};