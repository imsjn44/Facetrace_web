import React from "react";
import { useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import {
  Input,
  TextField,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PoliceLogo from "../images/nppolicelogo.png";
import { useSnackbar } from "notistack";
import axios from "axios";

const HomePage = () => {
  const [senderCitizenship, setSenderCitizenship] = useState(null);
  const [victimImage, setVictimImage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState({
    sender_firstname: "Dennis",
    sender_lastname: "Ritchie",
    sender_address: "Kathmandu",
    sender_phone: "9830178845",
    firstname: "Nabin",
    lastname: "Dhakal",
    moredetails:
      "The person who's missing is wearing blue pants and a t-shirt. They are not around, and people are looking for them. They are friendly and dependable, and if they are found, everyone will be happy to have them back.",
    number: "9840178446",
    age: "22",
    address: "Banepa",
    date: "2023-02-02",
    lastlocation: "Sallaghari, Bhaktapur",
    gender: "Male",
    relation: "Supervisor",
  });
  const resetForm = () => {
    setUser({
      sender_firstname: "",
      sender_lastname: "",
      sender_address: "",
      sender_phone: "",
      firstname: "",
      lastname: "",
      moredetails: "",
      number: "",
      age: "",
      address: "",
      date: "",
      lastlocation: "",
      gender: "",
      relation: "",
    });

    setSenderCitizenship(null);
    setVictimImage(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/victim-submit`,
        {
          sender_details: {
            firstname: user.sender_firstname,
            lastname: user.sender_lastname,
            address: user.sender_address,
            phone: user.sender_phone,
            relationship: user.relation,
            citizenship_card: senderCitizenship,
          },
          victim_details: {
            firstname: user.firstname,
            lastname: user.lastname,
            age: user.age,
            address: user.address,
            date: user.date,
            phone: user.number,
            moredetails: user.moredetails,
            gender: user.gender,
            lastlocation: user.lastlocation,
            victim_image: victimImage,
          },
        },
      );
      if (response.status === 200) {
        resetForm();
        enqueueSnackbar(response.data.status, { variant: "success" });
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 503) {
        enqueueSnackbar(error.response.data.detail, { variant: "error" });
      }
    }
  };

  const handleVictimImageChange = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVictimImage(reader.result);
    };
  };

  const handleCitizenshipChange = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSenderCitizenship(reader.result);
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        justifyContent: "center",
        mt: 5,
        border: "2px solid #3f51b5",
        borderRadius: "15px",
        maxWidth: 700,
        padding: 5,
        boxShadow: 24,
        mx: "auto",
        bgcolor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
          mt: -2,
        }}
      >
        <img
          src={PoliceLogo}
          alt="PoliceLogo"
          style={{ height: "70px", width: "75px" }}
        />
      </Box>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "700",
          color: "#004163",
        }}
      >
        Crime Investment Department
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 15,
          fontWeight: "700",
          color: "#004163",
          mb: 2,
        }}
      >
        "वस्तुनिष्ठ अपराध अनुसन्धान, मानव अधिकारको सम्मान"
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "700",
          color: "#004163",
        }}
      >
        Details of User
      </Typography>
      <Grid spacing={2} container>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.sender_firstname}
            name="sender_firstname"
            required
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.sender_lastname}
            name="sender_lastname"
            required
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Last name"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid spacing={2} container>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.sender_phone}
            name="sender_phone"
            required
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Mobile Number"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.relation}
            required
            name="relation"
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Relation to the missing person"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>

      <TextField
        onChange={handleChange}
        value={user.sender_address}
        required
        name="sender_address"
        sx={{
          mt: 2,

          mb: 2,
        }}
        id="outlined-basic"
        label="Address"
        variant="outlined"
        fullWidth
      />
      <InputLabel htmlFor="image-upload" sx={{ mb: 1 }}>
        Citizenship Card's Photo
      </InputLabel>
      <Input
        id="image-upload"
        type="file"
        onChange={handleCitizenshipChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              component="label"
              htmlFor="image-upload"
              edge="end"
              color="primary"
            >
              <PhotoCamera />
            </IconButton>
          </InputAdornment>
        }
      />

      {senderCitizenship && (
        <div>
          <p>Your Selected Image:</p>
          <img src={senderCitizenship} alt="Selected" width="150px" />
        </div>
      )}
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "700",
          mt: 4,
          color: "#004163",
        }}
      >
        Details of the Victim
      </Typography>
      <Grid spacing={2} container>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.firstname}
            name="firstname"
            required
            sx={{
              mt: 2,
              mb: 2,
            }}
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.lastname}
            name="lastname"
            required
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Last name"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid spacing={2} container>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.age}
            name="age"
            required
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Age"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.gender}
            name="gender"
            required
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Gender"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid spacing={2} container>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.address}
            name="address"
            required
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Address"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.lastlocation}
            name="lastlocation"
            required
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Last Seen Location"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.date}
            name="date"
            type="date"
            sx={{
              mt: 2,

              mb: 2,
            }}
            label="Last Seen Date"
            id="outlined-basic"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={user.number}
            name="number"
            sx={{
              mt: 2,

              mb: 2,
            }}
            id="outlined-basic"
            label="Mobile Number"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>

      <TextField
        onChange={handleChange}
        value={user.moredetails}
        name="moredetails"
        sx={{
          mt: 2,

          mb: 2,
        }}
        id="outlined-basic"
        label="More about the Person"
        variant="outlined"
        fullWidth
        multiline
      />
      <InputLabel htmlFor="image-upload" sx={{ mb: 1 }}>
        Victim's Photo
      </InputLabel>
      <Input
        id="image-upload"
        type="file"
        onChange={handleVictimImageChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              component="label"
              htmlFor="image-upload"
              edge="end"
              color="primary"
            >
              <PhotoCamera />
            </IconButton>
          </InputAdornment>
        }
      />

      {victimImage && (
        <div>
          <p>Your Selected Image:</p>
          <img src={victimImage} alt="Selected" width="150px" />
        </div>
      )}
      <Button
        type="submit"
        sx={{
          mx: "auto",
          display: "flex",
          borderRadius: "15px",
          bgcolor: "#004163",
          color: "white",
          mt: 5,
          paddingTop: "15px",
          paddingBottom: "15px",
          minWidth: 285,
          boxShadow: 24,

          ":hover": {
            mx: "auto",
            display: "flex",
            borderRadius: "15px",
            bgcolor: "#004163",
            color: "white",
            mt: 5,
            transform: "scale(1.05)",
            transition: "0.3s",
          },
        }}
      >
        Post
      </Button>
    </Box>
  );
};

export default HomePage;
