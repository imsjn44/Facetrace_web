import React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import VictimCard from './VictimCard';
import { Typography, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import PersonCard from './PersonCard';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MissingPersonPDF from './MissingPersonPDF';


const MissingPersonRequestGrid = ({ type, peopleData, setPeopleData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedCards, setAcceptedCards] = useState([]);
  const [filteredPeopleData, setFilteredPeopleData] = useState([]);


  useEffect(() => {
    setFilteredPeopleData(peopleData);
  }, [peopleData]);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const text = e.target.value;

    const people_data = peopleData.filter((person) =>
      person.firstname.toLowerCase().includes(text.toLowerCase()) || person.age.toString().includes(text) || (person.gender.toLowerCase() === text.toLowerCase() &&
        ['male', 'female'].includes(text.toLowerCase()))

    );
    setFilteredPeopleData(people_data);
  };






  return (
    <>


      <Paper elevation={7} sx={{ height: '100%', width: "80%", marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', mt: '30px', pt: 1 }} >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 2, mt: 5 }}>
          <Typography variant='h6' fontSize={25} sx={{ ml: 1 }} color='primary'>{type}</Typography>

          {
            peopleData?.length > 0 &&
            <Box sx={{ display: 'flex', gap: 3 }}>

              <PDFDownloadLink document={<MissingPersonPDF people={peopleData} />} fileName='MissingPeople.pdf'>
                <Button id="download-all-button" variant='outlined' size='small'>Download All</Button>
              </PDFDownloadLink>
              <TextField
                id="search-here"
                sx={{ marginRight: '8%', zIndex: 1 }}
                label="Search Here"

                variant="filled"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>
          }
        </Box>
        <Box sx={{ display: 'flex', gap: 3, p: 2 }}>
          {filteredPeopleData?.length === 0 && <Typography variant='h6' sx={{ ml: 2, color: 'grey' }}>No data found</Typography>
          }
          {filteredPeopleData?.map((person) => (
            <PersonCard person={person} key={person._id} setPeopleData={setPeopleData} />
          ))}
        </Box>

      </Paper>

    </>
  )
}

export default MissingPersonRequestGrid