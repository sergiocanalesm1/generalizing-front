import { AccountCircle } from '@mui/icons-material';
import { AppBar, Button, ButtonGroup, Container, Grid, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';

import AuthModal from './AuthModal';

//const pages = ['Relations', 'Lessons'];
//const settings = ['Profile', 'Logout'];

function Header() {
  

  const [isLogged, setIsLogged] = useState( false );
  //for modal
  const [open, setOpen] = useState( false );
  const [login, setLogin] = useState( false );
  const [signup, setSignup] = useState( false );

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
  };

  const handleLogout = useCallback(()=> {
    localStorage.removeItem('uuid');
    setIsLogged(false);
  },[])

  useEffect(() => {
    setIsLogged( localStorage.getItem('uuid') );
  }, []);
  return (
    <div>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              color="secondary"
            >
              GENERALIZING
            </Typography>
          {isLogged 
            ? 
              <Grid container justifyContent="flex-end">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="secondary"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                </Menu>
              </Grid>
              
            : <Grid
                container
                justifyContent="flex-end"
              >
                <ButtonGroup 
                  variant="text" 
                  aria-label="text button group"
                  color="secondary"
                >
                  <Button
                    onClick={()=>{
                      setOpen(true)
                      setSignup(true)
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    onClick={()=>{
                      setOpen(true)
                      setLogin(true)
                    }}
                  >
                    Login
                  </Button>
                </ButtonGroup>
              </Grid>
          }
          </Toolbar>
        </Container>
      </AppBar>
      <AuthModal
        open={open}
        setOpen={setOpen}
        login={login}
        signup={signup}
        setSignup={setSignup}
        setLogin={setLogin}
      />
    </div>
  );
}

export default Header;
