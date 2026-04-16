import React, { useEffect } from 'react'
import Live from './Live'
import { Box, Grid, Paper, Typography } from '@mui/material';
import MatchPair from './MatchPair';


function MatchPage() {
    const [matches, setMatches] = React.useState([]);
    return (

        <Paper elevation={7} sx={{ p: 2, height: '40%', width: "80%", marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', mt: '60px', pt: 1 }} >
            <Typography variant="h5" color='primary'>FaceTrace</Typography>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>


                    <Live setMatches={setMatches} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant='h5' color='primary'> MATCHES {matches.length}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>

                        {
                            matches.map((match, index) => {
                                return <MatchPair key={index} match={match} />
                            })
                        }
                    </Box>

                </Grid>
            </Grid>

        </Paper>
    )
}

export default MatchPage