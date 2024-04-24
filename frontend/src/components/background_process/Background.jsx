import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../../store/userSlice";

const Background = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users.token === "") {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      const designation = localStorage.getItem("designation");
      const name = localStorage.getItem("name");
      const isVerified = localStorage.getItem("isVerified");
      dispatch(userAction.setToken({ token, email, designation, name, isVerified }));
    }
    console.log(users);
  }, [users]);
  return <></>;
};

export default Background;
