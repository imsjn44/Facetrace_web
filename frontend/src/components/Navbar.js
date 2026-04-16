import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography, useScrollTrigger, useMediaQuery, TextField, Tabs, Tab, SwipeableDrawer, Drawer, Accordion, AccordionSummary, AccordionDetails, IconButton, Button } from '@mui/material';
import { BiSolidContact } from "react-icons/bi";
import { FaInstagram, FaPhone } from "react-icons/fa6";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from '@mui/material'
import ColorPalette from './Colorpalatte';
import { ThemeProvider } from '@mui/material';
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import PoliceLogo from '../images/nppolicelogo.png'
import { IoMenuOutline } from "react-icons/io5";
import { useSnackbar } from 'notistack';







const Navbar = ({loggedIn, setLoggedIn}) => {

    const theme = useTheme()
    const NavTabs = ['Home', 'About Us', 'Organisation Structure', 'CID Wings', 'Police']
    const [value, setValue] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false)
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        setLoggedIn(false);
        enqueueSnackbar('Logged Out Successfully', { variant: 'success' });
        navigate('/');

    }


    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 28);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [])

    const [expanded, setExpanded] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleAccordionChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const handleAccordionClick = () => {
        setExpanded(!expanded)
    }


    const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMediumScreen2 = useMediaQuery(theme.breakpoints.up('md'));


    const trigger = useScrollTrigger({
        threshold: '100px',
        disableHysteresis: true
    });



    const handleLogin = (index) => {
        if (index === 4) {
            navigate('/police');
        }
    }


    return (
        <>


            <Grid container sx={{

                backgroundColor: '#004163',
                width: '100%',


                height: isMediumScreen2 ? '28px' : isMediumScreen && isExtraSmallScreen ? '56px' : '84px',
                zIndex: isScrolled ? 0 : 1000,


            }}
            >
                {!isExtraSmallScreen && (
                    <Grid item xs={12} sm={12} md={4.5} >
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>


                            <BiSolidContact style={{ color: 'white', paddingLeft: isMediumScreen ? 0 : '12%', fontSize: '1.4rem', paddingTop: '1%' }} />
                            <Typography style={{ fontFamily: 'Arial', color: 'white', fontSize: '.75rem', paddingLeft: '2%', paddingTop: '1%' }}>

                                Emergency Contacts

                            </Typography>
                        </Box>

                    </Grid>
                )}
                <Grid item xs={12} sm={12} md={4}  >
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>


                        <FaPhone style={{ color: 'white', paddingTop: '1%' }} />
                        <Typography style={{ fontFamily: 'Arial', color: 'white', fontSize: '0.75rem', paddingLeft: '2%', paddingTop: '1%' }}>
                            Police Control: 100, Toll Free No.: 16600141516
                            
                        </Typography>
                        
                    </Box>
                    
                    

                </Grid>
                <Grid item xs={12} sm={12} md={3.5}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'white' }}>



                        <ThemeProvider theme={ColorPalette}>

                            <TextField

                                required
                                className='Text-field'
                                id="standard-required"
                                color='primary'
                                variant="standard"
                                InputProps={{
                                    startAdornment: (
                                        <HiOutlineSearch style={{ color: 'white', fontSize: '1.4rem' }} />
                                    )
                                }}

                            />
                        </ThemeProvider>
                        {
                            loggedIn && (

                                <Button onClick={handleLogout} size='small' sx={{color:'white' ,mr:2}}>LogOut</Button>
                            )
                        }
                        <Link href="https://www.facebook.com/NepalPolicePHQ/" style={{ paddingRight: "4%" }}>
                            <FaFacebookF style={{ color: 'white', fontSize: '1.2rem', cursor: 'pointer' }} />
                        </Link>
                        <Link href="https://twitter.com/NepalPoliceHQ" style={{ paddingRight: "4%" }}>
                            <FaXTwitter style={{ color: 'white', fontSize: '1.2rem', cursor: 'pointer' }} />
                        </Link>
                        <Link href="https://www.instagram.com/nepalpolice/" style={{ paddingRight: "4%" }}>
                            <FaInstagram style={{ color: 'white', fontSize: '1.3rem', cursor: 'pointer' }} />
                        </Link>
                        <Link href="https://www.youtube.com/channel/UCMkrAY5yFo5eQ1SCj9aV28w" style={{ paddingRight: "4%" }}>
                            <FaYoutube style={{ color: 'white', fontSize: '1.2rem', cursor: 'pointer' }} />
                        </Link>

                    </Box>

                </Grid>


            </Grid>

            <Grid container sx={{
                position: 'sticky', backgroundColor: 'rgb(30, 127, 178)',
                height: isMediumScreen2 ? '28px' : isMediumScreen && isExtraSmallScreen ? '56px' : '84px',
                height: isScrolled ? '50px' : '70px',
                width: '100%',
                zIndex: 10,
                top: 0,




            }} >



                <Grid item xs={12} sm={12} md={5} lg={3.5} >

                    <Box onClick={() => navigate('/')} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'white' }} >
                        <img variant='button' src={PoliceLogo} alt="PoliceLogo" style={{ height: isScrolled ? '45px' : '65px', width: isScrolled ? '50px' : '70px', marginLeft: '10%', cursor: 'pointer' }} />
                        <Typography style={{ fontFamily: 'Arial', color: 'white', fontSize: isMediumScreen ? '13px' : '15px', fontWeight: 'bold', marginLeft: '2%', cursor: 'pointer' }}>Crime Investigation Department</Typography>

                    </Box >

                </Grid>
                {!isMediumScreen && (
                    <Grid item xs={12} sm={12} md={5} lg={6.5}>

                        <Box >
                            <Tabs
                                value={value}
                                TabIndicatorProps={{
                                    style: {
                                        top: 0,
                                        backgroundColor: 'rgb(255, 203, 5)',
                                        height: '4px',


                                    }
                                }}


                                onChange={handleChange}

                                variant='scrollable'

                                scrollButtons={true}

                            >

                                {NavTabs.map((navtab, index) => (
                                    <Tab onClick={() => handleLogin(index)} style={{ fontFamily: 'Arial', color: 'white', fontWeight: 'revert', fontSize: '0.rem', textTransform: 'initial' }} disableRipple={true} sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', mt: isScrolled ? '0.25%' : '1%', }} key={index} label={navtab}>
                                    </Tab>
                                ))

                                }

                            </Tabs>
                        </Box>

                    </Grid>
                )}
                <Grid item xs={12} sm={12} md={2} lg={2} >

                    {isMediumScreen && (
                        <Box sx={{

                        }}>

                            <Accordion
                                expanded={expanded}
                                sx={{ backgroundColor: 'rgb(30, 127, 178)' }}

                            >
                                <AccordionSummary
                                    expandIcon={<IoMenuOutline onClick={handleAccordionClick} style={{ color: 'white', fontSize: '2rem', cursor: 'pointer' }} />}

                                >
                                </AccordionSummary>

                                <AccordionDetails>

                                    <Tabs
                                        value={value}
                                        sx={{backgroundColor: 'rgb(30, 127, 178)' }}
                                        orientation='vertical'
                                        centered
                                        onClick={
                                            () => setExpanded(false)

                                        }

                                        onChange={handleChange}

                                    >


                                        {NavTabs.map((navtab, index) => (
                                            <Tab
                                                disableRipple={true}

                                                style={{ fontFamily: 'Arial', color: 'white', fontWeight: 'normal', fontSize: '0.rem', textTransform: 'initial' }} sx={{ mt: isScrolled ? '0.25%' : '1%', marginLeft: 'auto', marginRight: 'auto' }} key={index} label={navtab}>
                                                {/* {console.log(navtab)} */}
                                            </Tab>
                                        ))

                                        }

                                    </Tabs>
                                </AccordionDetails>
                            </Accordion>
                        </Box>

                    )}

                </Grid>

            </Grid>






        </>
    )
}



export default Navbar;
