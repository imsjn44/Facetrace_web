import { Box, Card, CardMedia, Typography } from '@mui/material'
import React from 'react'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';


function MatchPair({ match }) {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
            <Card sx={{ width: 75 }}>
                <CardMedia
                    component="img"
                    height="75px"
                    image={match.anchor}
                    alt="green iguana">
                </CardMedia>
            </Card>
            <CompareArrowsIcon fontSize='large' color='success' />
            <Card sx={{ width: 75 }}>
                <CardMedia
                    component="img"
                    height="75px"
                    image={match.positive}
                    alt="green iguana">
                </CardMedia>
            </Card>
            <Box sx={{display:'flex', flexDirection:'column'}}>
                <Typography color='success' variant='h6' sx={{color:'green'}}>Match Found!</Typography>
                <Typography color='secondary' sx={{ fontSize: 15 }}>{match.datetime} </Typography>
                <Typography color='secondary' sx={{ fontSize: 15 }}>Banepa, Kavre!!</Typography>
            </Box>
        </Box>
    )
}

export default MatchPair