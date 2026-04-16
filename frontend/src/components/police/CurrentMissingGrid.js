import { Paper, Box, Typography, Tabs, Tab, TextField, MenuItem, Menu, Button, Grid } from '@mui/material'
import { React, useState, useEffect } from 'react'
import { IoEye } from "react-icons/io5";
import { MdDownload } from "react-icons/md";
import CardComponent from './VictimCard';
import MissingPersonPDF from './MissingPersonPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PersonCard from './PersonCard';



const MissingComponent = ({ peopleData, setPeopleData }) => {
  const [filterType, setFilterType] = useState('Both');

  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [filteredPeople, setFilteredPeople] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  const filterPeople = (searchQuery, minAge, maxAge, type = filterType) => {
    const filtered = peopleData?.filter((person) => {
      const ageFilter =
        type === 'Child'
          ? person.age >= 0 && person.age <= 17
          : type === 'Adult'
            ? person.age > 17
            : true;

      const nameMatch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
      const ageMatch = person.age.toString().includes(searchQuery);
      const genderMatch =
        person.gender.toLowerCase() === searchQuery.toLowerCase() &&
        ['male', 'female'].includes(searchQuery.toLowerCase());

      const withinAgeRange =
        (minAge === '' || person.age >= parseInt(minAge)) &&
        (maxAge === '' || person.age <= parseInt(maxAge));

      return (nameMatch || ageMatch || genderMatch) && ageFilter && withinAgeRange;
    });
    setFilteredPeople(filtered);
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterPeople(e.target.value, minAge, maxAge);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    setAnchorEl(null);
    filterPeople(searchQuery, minAge, maxAge, type);
  };

  const handleMinAgeChange = (e) => {
    setMinAge(e.target.value);
  };

  const handleMaxAgeChange = (e) => {
    setMaxAge(e.target.value);
  };

  const handleAgeRangeFilter = () => {
    filterPeople(searchQuery, minAge, maxAge);
  };


  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  console.log(peopleData)

  const onAccept = true
  return (
    <Paper elevation={7} sx={{ width: "80%", marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', mt: '30px' }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '2%', }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h5' style={{ fontFamily: 'Arial', color: 'rgb(30, 127, 178)', fontWeight: 'bolder' }}>Missing Person</Typography>
          <PDFDownloadLink document={<MissingPersonPDF people={peopleData} />} fileName='test.pdf'>

            <Button
              id="download-all-button"
              sx={{ mt: '10%' }}

              variant='contained'
            >
              Download All
            </Button>
          </PDFDownloadLink>
        </Box>
        <Paper elevation={7} sx={{ display: 'flex', alignItems: 'center', pt: '1%', pb: '1%', pr: '0.5%', pl: '0.5%' }}>
          <Button
            id="filter-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            variant='contained'
            sx={{ mr: '1%' }}
          >
            Filter
          </Button>
          <TextField
            label="Min Age"
            value={minAge}
            onChange={handleMinAgeChange}
            type="number"
            sx={{ width: '10ch' }}

          />-<TextField
            label="Max Age"
            value={maxAge}
            onChange={handleMaxAgeChange}
            type="number"
            sx={{ width: '10ch' }} />
          <Button
            sx={{ ml: '1%' }}
            variant='contained' onClick={handleAgeRangeFilter}>OK</Button>
        </Paper>


        <TextField
          id="search-here"

          label="Search Here"
          variant="filled"
          value={searchQuery}
          onChange={handleSearchChange}

        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => handleFilter('Child')}>Child</MenuItem>
          <MenuItem onClick={() => handleFilter('Adult')}>Adult</MenuItem>
          <MenuItem onClick={() => handleFilter('Both')}>Both</MenuItem>
        </Menu>
      </Box>
      <Typography variant='body1' sx={{ pb: '1%', ml: '2%' }} style={{ fontFamily: 'Arial', color: '#000', fontWeight: 'bold' }}>All details of missing persons from 2023-12-16 onwards</Typography>

      <Box sx={{ display: 'flex', gap: 3, p: 2 }}>
        {peopleData?.map((person) => (
          <PersonCard person={person} key={person._id} setPeopleData={setPeopleData} />
        ))}
      </Box>

    </Paper>
  )
}


export default MissingComponent