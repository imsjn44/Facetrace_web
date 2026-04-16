import React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { Typography, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import FoundPersonCard from './FoundPersonCard';

function FoundPeople() {
    const [searchQuery, setSearchQuery] = useState('');
    const [peopleData, setPeopleData] = useState([]);
  
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
    useEffect(() => {  
        async function fetchData() {
            try{
                const response = await axios.get('http://localhost:8000/api/found-victims/');
                setPeopleData(response.data);
            }
            catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []) 
    return (
        <Paper elevation={7} sx={{ height: '100%', width: "80%", marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', mt: '30px', pt: 1 }} >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 2, mt: 5 }}>
                <Typography variant='h6' fontSize={25} sx={{ ml: 1 }} color='primary'>Found People</Typography>
                {
                    peopleData?.length > 0 &&
                    <Box sx={{ display: 'flex', gap: 3 }}>
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
                {peopleData?.length === 0 && <Typography variant='h6' sx={{ ml: 2, color: 'grey' }}>No data found</Typography>
                }
                {peopleData?.map((person) => (
                    <FoundPersonCard person={person} key={person._id} setPeopleData={setPeopleData}/>
                ))}
            </Box>

        </Paper>

    )
}

export default FoundPeople