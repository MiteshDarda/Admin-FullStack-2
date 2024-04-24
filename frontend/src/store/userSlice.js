import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  isVerified: false,
  name: "",
  designation: "",
  email: "",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const { token, isVerified, name, designation, email } = action.payload;
      if (token) state.token = token;
      if (isVerified) state.isVerified = isVerified;
      if (name) state.name = name;
      if (designation) state.designation = designation;
      if (email) state.email = email;
    },
  },
});

export default userSlice.reducer;
export const userAction = userSlice.actions;
