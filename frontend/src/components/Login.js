import React from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { Link } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import PoliceLogo from "./Images/nppolicelogo.png";
import { useSnackbar } from "notistack";
import axios from "axios";

const Signin = ({ setLoggedIn }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [user, setUser] = useState({
    password: "",
    username: "",
  });
  const handeleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", user.username);
      formData.append("password", user.password);

      const response = await axios.post(
        `${process.env.VITE_API_URL}/token`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("token_type", response.data.token_type || "bearer");

      console.log("LOGIN RESPONSE:", response.data);
      enqueueSnackbar("Login Successful", { variant: "success" });
      setLoggedIn(true);
      navigate("/police");
    } catch (error) {
      console.log("Error during login:", error.response?.data || error);
      enqueueSnackbar("Login Failed", { variant: "error" });
    }
  };

  return (
    <React.Fragment>
      <Container>
        <Box boxShadow={24} mt={5} mb={5}>
          {" "}
          <Grid container spacing={2} sx={{ marginTop: "auto" }}>
            <Grid item xs={12} lg={6} md={6}>
              <Box
                sx={{
                  bgcolor: "#004163",
                  paddingTop: { xs: "10%", md: "35%" },
                  paddingBottom: { xs: "10%", md: "50%" },
                  mt: -2,
                }}
              >
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={PoliceLogo}
                    alt="PoliceLogo"
                    style={{ height: "120px", width: "120px" }}
                  />
                </Box>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Crime Investment Department
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: "700",
                    color: "white",
                    mb: 2,
                    mt: 1,
                  }}
                >
                  "Login System"
                </Typography>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
              {" "}
              <Box sx={{ padding: { xs: 3, lg: 8, md: 3 } }}>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  textAlign={"center"}
                  fontSize={"1.5rem"}
                >
                  LOGIN
                </Typography>
                <TextField
                  value={user.username}
                  name="username"
                  onChange={handeleChange}
                  sx={{
                    mt: 2,

                    mb: 2,
                  }}
                  id="outlined-basic"
                  label="Username"
                  variant="outlined"
                  fullWidth
                />
                <FormControl
                  sx={{
                    mt: 2,
                  }}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    value={user.password}
                    name="password"
                    onChange={handeleChange}
                    label="Password"
                  />{" "}
                </FormControl>

                <Button
                  onClick={handleLogin}
                  sx={{
                    backgroundColor: "#004163",
                    color: "white",

                    mt: 4,
                    fontSize: "1.2rem",
                    textTransform: "none",
                    textAlign: "center",

                    ":hover": { bgcolor: "#004163", transform: "scale(1.05)" },
                  }}
                  fullWidth
                >
                  LogIn
                </Button>
                <Typography sx={{ textAlign: "center", mt: 1 }}>
                  Forget Password?
                </Typography>
                <Link to="/register">
                  <Typography
                    sx={{
                      textAlign: "center",
                      mt: 2,

                      textUnderlined: "none",
                    }}
                  >
                    Don't have an account? Register
                  </Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Signin;
