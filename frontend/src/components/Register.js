import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Container,
} from "@mui/material";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { Link, useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import PoliceLogo from "./Images/nppolicelogo.png";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSnackbar } from "notistack";
import axios from "axios";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const handleRegistration = async () => {
    const { firstName, lastName, password, confirmPassword, username } = user;
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords didn't match", { variant: "error" });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        {
          first_name: firstName,
          last_name: lastName,
          username: username,
          password: password,
        },
      );
      if (response) {
        enqueueSnackbar(response.data.status, { variant: "success" });
        setUser({
          firstName: "",
          lastName: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      } else {
        enqueueSnackbar("some error occurred!", { variant: "error" });
      }
    } catch (error) {
      // Update this block to get the real error
      const errorMsg =
        error.response?.data?.message || "Server Error: Check Backend Logs";
      console.error("Full Error Object:", error.response?.data);
      enqueueSnackbar(errorMsg, { variant: "error" });
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
                  paddingBottom: { xs: "10%", md: "40%" },
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
                  "Registration System"
                </Typography>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
              <Box sx={{ padding: 5 }}>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  textAlign={"center"}
                  fontSize={"1.5rem"}
                >
                  REGISTRATION
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    name="firstName"
                    value={user.firstName}
                    sx={{
                      mt: 4,

                      mb: 2,
                    }}
                    label="First Name"
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    name="lastName"
                    value={user.lastName}
                    sx={{
                      mt: 4,

                      mb: 2,
                    }}
                    label="Last Name"
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                  />
                </Box>
                <TextField
                  name="username"
                  value={user.username}
                  sx={{
                    mt: 2,

                    mb: 2,
                  }}
                  label="username"
                  variant="outlined"
                  onChange={handleChange}
                  fullWidth
                />
                <Box sx={{ display: "flex" }}>
                  <TextField
                    name="password"
                    value={user.password}
                    sx={{
                      mt: 2,

                      mb: 2,
                    }}
                    type="password"
                    label="Password"
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    name="confirmPassword"
                    value={user.confirmPassword}
                    sx={{
                      mt: 2,

                      mb: 2,
                    }}
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                  />
                </Box>

                <Button
                  onClick={handleRegistration}
                  sx={{
                    backgroundColor: "#004163",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                    fontSize: "1.2rem",
                    textTransform: "none",
                    padding: "10px",
                    width: "150px",
                    margin: "auto",
                    ":hover": { bgcolor: "#004163", transform: "scale(1.1)" },
                  }}
                >
                  Register
                </Button>

                <Link to="/login">
                  <Typography sx={{ textAlign: "center", mt: 2, mb: 3 }}>
                    Already have an account? SIGN IN
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

export default Register;
