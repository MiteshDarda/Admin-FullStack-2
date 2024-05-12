import { Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import Logout from "../../../utils/logout";
import { useOutletContext } from "react-router-dom";
import { changePassword } from "../../../api/users/changePassword";

const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const loaderData = useRouteLoaderData("root");
  const navigate = useNavigate();
  const [setAlertMessage] = useOutletContext();

  const fields = [
    {
      title: "Old Password",
      value: oldPassword,
      setter: setOldPassword,
      id: "oldPassword",
    },
    {
      title: "New Password",
      value: newPassword,
      setter: setNewPassword,
      id: "newPassword",
    },
    {
      title: "Confirm Password",
      value: confirmPassword,
      setter: setConfirmPassword,
      id: "confirmPassword",
    },
  ];

  const handleChangePassword = async (event) => {
    event.preventDefault();
    fields.forEach((value) => {
      value.setter((old) => old.trim());
    });
    setSubmitted(false);
    setError(false);

    if (
      oldPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === "" ||
      newPassword !== confirmPassword
    ) {
      setSubmitted(true);
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setError({
        message: `Password must contain: \n 
        one digit from 0 to 9 \n
         one lowercase  & uppercase letter & special character \n
          no space and it must be between 8-16 characters long
          `
      });
      return;
    }
    setSubmitted(true);
    let data = JSON.stringify({
      old: oldPassword,
      new: newPassword,
    });

    const response = await changePassword(data, loaderData.token);
    if (response.status === 200) {
      setAlertMessage("Password changed successfully.");
      navigate("/");
    }
    if (response.status === 401) {
      if (response.data.message === "Expire") {
        Logout(navigate);
      }
      setError(response.data);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="pt-5">
      <div className="w-[50vw] mx-auto">
        {fields.map((value, i) => (
          <div className="mb-5" key={i}>
            <TextField
              fullWidth
              label={value.title}
              type="password"
              value={value.value}
              onChange={(event) => {
                value.setter(event.target.value);
              }}
              id={value.id}
              name={value.id}
              variant="outlined"
              error={submitted && value.value.trim() === "" ? true : false}
              onFocus={() => {
                setSubmitted(false);
              }}
              required
            />
          </div>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Change Password
        </Button>

        {submitted && newPassword !== confirmPassword && (
          <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
            Passwords do not match!
          </Typography>
        )}

        {error && (
          <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
            {error.message} {/* Display error message */}
          </Typography>
        )}
      </div>
    </form>
  );
};

export default ChangePassword;

// import { Typography } from "@mui/material";
// import { useState } from "react";
// import { useNavigate, useRouteLoaderData } from "react-router-dom";
// import Logout from "../../../utils/logout";
// import { useOutletContext } from "react-router-dom";
// import {changePassword} from "../../../api/users/changePassword";

// const ChangePassword = () => {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState(false);

//   const loaderData = useRouteLoaderData("root");
//   const navigate = useNavigate();
//   const [setAlertMessage] = useOutletContext();

//   const fields = [
//     {
//       title: "Old Password",
//       value: oldPassword,
//       setter: setOldPassword,
//       id: "oldPassword",
//     },
//     {
//       title: "New Password",
//       value: newPassword,
//       setter: setNewPassword,
//       id: "newPassword",
//     },
//     {
//       title: "Confirm Password",
//       value: confirmPassword,
//       setter: setConfirmPassword,
//       id: "confirmPassword",
//     },
//   ];

//   const handleChangePassword = async (event) => {
//     event.preventDefault();
//     fields.map((value) => {
//       value.setter((old) => old.trim());
//     });
//     setSubmitted(false);
//     setError(false);

//     if (
//       oldPassword.trim() === "" ||
//       newPassword.trim() === "" ||
//       confirmPassword.trim() === "" ||
//       newPassword != confirmPassword
//     ) {
//       setSubmitted(true);
//       return;
//     }
//     setSubmitted(true);
//     let data = JSON.stringify({
//       old: oldPassword,
//       new: newPassword,
//     });

//     const response = await changePassword(data,loaderData.token);
//     if (response.status === 200) {
//       setAlertMessage("Password changed sucessfully.");
//       navigate("/");
//     }
//     if (response.status === 401) {
//       if (response.data.message === "Expire") {
//         Logout(navigate);
//       }
//       setError(response.data);
//     }

//   };

//   return (
//     <form onSubmit={handleChangePassword}>
//       <div className="w-[50vw] mx-auto">
//         {fields.map((value, i) => {
//           return (
//             <div className="mb-5" key={i}>
//               <label
//                 htmlFor={value.id}
//                 className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-black"
//               >
//                 {value.title}
//               </label>
//               <input
//                 type="password"
//                 value={value.value}
//                 onChange={(event) => {
//                   value.setter(event.target.value);
//                 }}
//                 id={value.id}
//                 name={value.id}
//                 className={` shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-100 dark:border-gray-600 dark:placeholder-gray-900 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light ${
//                   submitted &&
//                   value.value.trim() === "" &&
//                   "ring-[4px] ring-red-500"
//                 }`}
//                 required
//               />
//             </div>
//           );
//         })}

//         <button
//           type="submit"
//           className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//         >
//           Change Password
//         </button>

//         {submitted && newPassword !== confirmPassword && (
//           <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
//             Passwords do not match!
//           </Typography>
//         )}

//         {error && (
//           <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
//             {error.message} {/* Display error message */}
//           </Typography>
//         )}
//       </div>
//     </form>
//   );
// };
// export default ChangePassword;
