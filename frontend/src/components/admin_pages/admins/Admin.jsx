import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import AdminTable from "./AdminTable";
import Form from "../../reusable/modal/Form";
import createUsers from "../../../api/users/createUsers";
import { useSelector } from "react-redux";
import Logout from "../../../utils/logout";
import { canCreateUser } from "../../../utils/designation/canCreateUser";

const User = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [setAlertMessage, setSeverity] = useOutletContext();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.users);
  const inputs = [
    {
      id: "name",
      type: "text",
      label: "Name",
      state: name,
      setState: setName,
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      state: email,
      setState: setEmail,
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      state: password,
      setState: setPassword,
    },
    {
      id: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      state: confirmPassword,
      setState: setConfirmPassword,
    },
    {
      id: "designation",
      type: "select",
      values: canCreateUser(user?.designation ?? ""),
      label: "Designation",
      state: designation,
      setState: setDesignation,
    },
  ];

  const createUser = async () => {
    setLoading(true);
    try {
      const response = await createUsers(
        name,
        email,
        password,
        designation,
        user.token,
        setSeverity,
        setAlertMessage,
      );
      setLoading(false);
      if (response.status === 201) {
        setAlertMessage(`User created sucessfully.`);
        setRows((prev) => {
          return [
            ...prev,
            {
              name,
              email,
              designation,
              createdAt: new Date(),
              isVerified: false,
            },
          ];
        });
      } else if (response.status === 400) {
        setSeverity("error");
        setAlertMessage(`${response.data.message}`);
      } else if (response.status === 401) Logout(navigate);
      else {
        setSeverity("warning");
        setAlertMessage("Server Error.");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="p-[2rem] bg-gray-100 mx-0 pb-0">
        <div className="flex justify-between">
          <h1 className="text-[32px] my-[1rem] font-bold">Users</h1>
          <motion.button
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.7 }}
            className="bg-[#006eff] text-white font-semibold px-5 py-1 h-12 mt-5  "
            onClick={() => {
              setOpen(true);
            }}
          >
            New User
          </motion.button>
        </div>
      </div>
      <div className="p-8 bg-gray-100 ">
        <AdminTable rows={rows} setRows={setRows} />
      </div>
      <Form
        state={open}
        setState={setOpen}
        title="Create User"
        button={true}
        inputs={inputs}
        loading={loading}
        submit={createUser}
      />
    </>
  );
};
export default User;
