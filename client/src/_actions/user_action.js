import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types";

export function loginUser(dataToSubmit) {
  return async (dispatch) => {
    try {
      const res = await axios.post("/api/users/login", dataToSubmit);
      dispatch({
        type: LOGIN_USER,
        payload: res.data,
      });
      return res;
    } catch (error) {
      console.error("Login:", error);
      throw error;
    }
  };
}

export function registerUser(dataToSubmit) {
  return async (dispatch) => {
    try {
      const res = await axios.post("/api/users/register", dataToSubmit);
      dispatch({
        type: REGISTER_USER,
        payload: res.data,
      });
      return res;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };
}

export function auth() {
  return async (dispatch) => {
    try {
      const res = await axios.get("/api/users/auth");
      dispatch({
        type: AUTH_USER,
        payload: res.data,
      });
      return res;
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  };
}
