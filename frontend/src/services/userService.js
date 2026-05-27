import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user?.token;
};

// GET PROFILE
const getProfile = async () => {
  const token = getToken();

  const response = await axios.get(
    `${API_URL}/profile`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

// UPDATE PROFILE
const updateProfile = async (profileData) => {
  const token = getToken();

  const response = await axios.put(
    `${API_URL}/profile`,

    profileData,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

const uploadProfileImage = async (imageFile) => {
  const token = getToken();

  const formData = new FormData();

  formData.append(
    "image",

    imageFile,
  );

  const response = await axios.post(
    `${API_URL}/upload-profile-image`,

    formData,

    {
      headers: {
        Authorization: `Bearer ${token}`,

        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

const userService = {
  getProfile,

  updateProfile,

  uploadProfileImage,
};
export default userService;
