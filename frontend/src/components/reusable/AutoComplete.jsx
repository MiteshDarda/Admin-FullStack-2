import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getUsers from "../../api/users/getUsers";

const limit = 1000;
const page = 1;

export default function Asynchronous(props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const user = useSelector((state) => state.users);

  const getAllUsers = async () => {
    try {
      if (user.token) {
        const response = await getUsers(user.token, limit, page);
        if (response.status === 200) {
          try {
            props?.setPeople(response.data.people);
          } catch (e) {
            console.log("");
          }
          setOptions(response.data.people);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    (async () => {
      await getAllUsers();
    })();
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      onChange={(event, selectedOption) => {
        if (selectedOption) {
          props.setEmail(selectedOption.email);
        } else {
          props.setEmail("");
        }
      }}
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.email === value.email}
      getOptionLabel={(option) => option.name + `(${option.email})`}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Email"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
}
