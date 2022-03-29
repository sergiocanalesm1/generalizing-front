import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountCircle } from '@mui/icons-material';
import { AppBar, Button, ButtonGroup, Container, Grid, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

import { homePath } from '../../utils/paths';
import AuthModal from './AuthModal';

//const pages = ['Relations', 'Lessons'];
//const settings = ['Profile', 'Logout'];

function Header() {

  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState( false );
 
  const [open, setOpen] = useState( false );
  const [signup, setSignup] = useState( false );

  const [anchorEl, setAnchorEl] = useState(null);
  const ref = useRef();

  const handleMenu = useCallback(() => {
    setAnchorEl(ref.current);
  },[ref]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  },[]);

  const handleProfile = () => {
  };

  const handleLogout = useCallback(()=> {
    localStorage.clear();
    setIsLogged(false);
    navigate( homePath );
  },[navigate])

  useEffect(() => {
    setIsLogged( localStorage.getItem('uuid') );
    setAnchorEl(null);
  }, [open,navigate]);

  return (
    <div>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
                  ref={ref}
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
                      setSignup(true);
                      setOpen(true)
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    onClick={()=>{
                      setSignup(false);
                      setOpen(true);
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
        isLogin={!signup}
        onClose={()=>{
          setOpen(false)
          setSignup(false);
        }}
      />
    </div>
  );
}

export default Header;
