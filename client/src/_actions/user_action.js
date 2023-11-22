import axios from "axios";
import { LOGIN_USER } from "./types";

export const loginUser = (dataToSubmit) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/api/users/login", dataToSubmit);
      dispatch({
        type: LOGIN_USER,
        payload: res.data,
      });
      return res;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
};
