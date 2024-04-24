import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Designation from "../utils/designation/designation";

export function checkVerified() {
  if (localStorage.getItem("isVerified") === "false")
    return redirect("/profile");
  else return true;
}

export function checkAuthLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }

  try {
    const decodedToken = jwtDecode(token);
    return { token, decodedToken };
  } catch (e) {
    console.log(e);
    localStorage.clear();
    return redirect("/login");
  }
}

export function checkAdmin() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }
  if (localStorage.getItem("isVerified") === "false")
    return redirect("/profile");
  try {
    const decodedToken = jwtDecode(token);
    if (
      decodedToken.designation !== Designation.SUPER_ADMIN &&
      decodedToken.designation !== Designation.ADMIN &&
      decodedToken.designation !== Designation.LEADER &&
      decodedToken.designation !== Designation.MANAGER
    )
      return redirect("/");
    else return true;
  } catch (e) {
    console.log(e);
    localStorage.clear();
    return redirect("/login");
  }
}
