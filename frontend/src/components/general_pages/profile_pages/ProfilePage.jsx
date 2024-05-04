import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../../utils/logout.jsx";
import { useOutletContext } from "react-router-dom/dist/umd/react-router-dom.development.js";
import {
  patchBankDetails,
  getBankDetails,
} from "../../../api/users/bankDetails.js";
import { useDispatch } from "react-redux";
import { userAction } from "../../../store/userSlice.js";
import { TextField, Button } from "@mui/material";

export default function ProfilePage() {
  const [submitted, setSubmitted] = useState(false);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [nameOnPassbook, setNameOnPassbook] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [panNum, setPanNum] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [setAlertMessage] = useOutletContext();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getBankDetails(token);
      if (response.status >= 300) {
        Logout(navigate);
      } else if (response.status === 200) {
        setAddress(response.data?.address ?? "");
        setMobile(response.data?.mobile ?? "");
        setNameOnPassbook(response.data?.nameOnPassbook ?? "");
        setBankName(response.data?.bankName ?? "");
        setAccountNumber(response.data?.accountNumber ?? "");
        setIfsc(response.data?.ifsc ?? "");
        setPanNum(response.data?.panNum ?? "");
      }
    };

    fetchUserData();
  }, []);

  const formValues = [
    {
      title: "Address",
      value: address,
      setter: setAddress,
      id: "address",
    },
    {
      title: "Mobile",
      value: mobile,
      setter: setMobile,
      id: "mobile",
    },
    {
      title: "Name on passbook",
      value: nameOnPassbook,
      setter: setNameOnPassbook,
      id: "nameOnPassbook",
    },
    {
      title: "Bank Name",
      value: bankName,
      setter: setBankName,
      id: "bankName",
    },
    {
      title: "Account Number",
      value: accountNumber,
      setter: setAccountNumber,
      id: "accountNumber",
    },
    {
      title: "IFSC Code",
      value: ifsc,
      setter: setIfsc,
      id: "ifsc",
    },
    {
      title: "Pan Number",
      value: panNum,
      setter: setPanNum,
      id: "panNum",
    },
  ];

  const getVerified = async (event) => {
    event.preventDefault();
    formValues.map((value) => {
      value.setter((old) => old.trim());
    });
    setSubmitted(false);
    if (
      address.trim() === "" ||
      mobile.trim() === "" ||
      nameOnPassbook.trim() === "" ||
      bankName.trim() === "" ||
      accountNumber.trim() === "" ||
      ifsc.trim() === "" ||
      panNum.trim() === ""
    ) {
      setSubmitted(true);
      return;
    }

    let data = JSON.stringify({
      address: address,
      mobile: mobile,
      nameOnPassbook: nameOnPassbook,
      bankName: bankName,
      accountNumber: accountNumber,
      ifsc: ifsc,
      panNum: panNum,
    });

    const response = await patchBankDetails(data, token);
    if (response.status === 200) {
      setAlertMessage("Bank details updated sucessfully.");
      localStorage.setItem("isVerified", true);
      dispatch(userAction.setToken({ isVerified: true }));

      navigate("/");
    } else Logout(navigate);
  };

  return (
    <form onSubmit={getVerified} className="pt-5">
      <div className="w-[50vw] mx-auto">
        {formValues.map((value, i) => (
          <div className="mb-5" key={i}>
            <TextField
              onFocus={() => {
                setSubmitted(false);
              }}
              fullWidth
              label={value.title}
              type="text"
              value={value.value}
              onChange={(event) => {
                value.setter(event.target.value);
              }}
              id={value.id}
              name={value.id}
              variant="outlined"
              error={submitted && value.value.trim() === "" ? true : false}
              required
            />
          </div>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Save
        </Button>
      </div>
    </form>
  );

  // return (
  //   <form onSubmit={getVerified}>
  //     <div className="w-[50vw] mx-auto">
  //       {formValues.map((value, i) => {
  //         return (
  //           <div className="mb-5" key={i}>
  //             <label
  //               htmlFor={value.id}
  //               className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-black"
  //             >
  //               {value.title}
  //             </label>
  //             <input
  //               type="text"
  //               value={value.value}
  //               onChange={(event) => {
  //                 value.setter(event.target.value);
  //               }}
  //               id={value.id}
  //               name={value.id}
  //               className={` shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-blue-100 dark:border-gray-600 dark:placeholder-gray-900 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light ${
  //                 submitted &&
  //                 value.value.trim() === "" &&
  //                 "ring-[4px] ring-red-500"
  //               }`}
  //               required
  //             />
  //           </div>
  //         );
  //       })}

  //       <button
  //         type="submit"
  //         className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  //       >
  //         Save
  //       </button>
  //     </div>
  //   </form>
  // );
}
