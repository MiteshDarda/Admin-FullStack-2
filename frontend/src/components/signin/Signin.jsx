import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getMyDetails, loginAPI } from "../../api/login/login";
import { useDispatch } from "react-redux";
import { userAction } from "../../store/userSlice";

const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [emailEmpty, setEmailEmpty] = React.useState(null);
  const [passwordEmpty, setPasswordEmpty] = React.useState(null);
  const [error, setError] = React.useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    setError(null);
    setEmailEmpty(null);
    setPasswordEmpty(null);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (email === "") {
      setEmailEmpty(true);
    }
    if (password === "") setPasswordEmpty(true);

    if (email === "" || password === "")
      return {
        status: 400,
        message: "Email/Password Empty",
      };

    if (!passwordRegex.test(password)) {
      setError({
        message: `Password must contain: \n 
        one digit from 0 to 9 \n
         one lowercase  & uppercase letter & special character \n
          no space and it must be between 8-16 characters long`,
      });
      return;
    }
    if (!emailRegex.test(email)) {
      setError({
        message: `Invalid Email`,
      });
      return;
    }

    const url = `${import.meta.env.VITE_URL}/users/login`;
    try {
      const response = await loginAPI(url, email, password);
      if (response.status === 400) {
        setError(response.data);
      } else if (response.status === 201) {
        const token = response.data.token;
        const { email, designation } = jwtDecode(token);
        const myDetails = await getMyDetails(token);
        const { name, isVerified } = myDetails.data;

        dispatch(
          userAction.setToken({ token, email, designation, name, isVerified }),
        );

        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("designation", designation);
        localStorage.setItem("name", name);
        localStorage.setItem("isVerified", isVerified);

        navigate("/");
      }
    } catch (e) {
      console.log("In the error");
    }
  };

  return (
    <div className="flex justify-center pt-20 ">
      <ThemeProvider theme={defaultTheme}>
        <Paper elevation={22}>
          <Container sx={{ mb: 12, pb: 4 }} component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography sx={{ pt: 3, pb: 2 }} component="h1" variant="h6">
                <b>eTeam Manager</b>
              </Typography>
              <Typography component="h2" variant="h5">
                <b>Login</b>
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  type="email"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={emailEmpty}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={passwordEmpty}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Box>
              {error && (
                <Typography variant="body2" color="error">
                  {error.message} {/* Display error message */}
                </Typography>
              )}
            </Box>
          </Container>
        </Paper>
      </ThemeProvider>
    </div>
  );
}
