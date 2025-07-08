import {
  Box,
  Button,
  Container,
  CssBaseline,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { googleLogin, loginUser } from "../../service/service";
import { googleLogin, loginUser } from "../../service/service";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default function Login() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(userEmail, userPassword);
      navigate("/");
    } catch (error: any) {
      alert(`${error.response?.data?.message || "Something went wrong."} `);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, []);

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div
        className={`flex flex-col items-center justify-center w-[100%] h-[100%] absolute top-0 left-0 bg-white`}
      >
        <div className="bg-[white] flex justify-center items-center p-4 flex-col rounded-[12px]">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-auto h-16 min-w-50 cursor-pointer"
          />
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={`w-full mt-1`} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    navigate("/logup");
                  }}
                >
                  Sign Up
                </Button>
              </div>
              <div className="flex">
                <Button
                  disabled
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleGoogleLogin();
                  }}
                >
                  Google Login
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
