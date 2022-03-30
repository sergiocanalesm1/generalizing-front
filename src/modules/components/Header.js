import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountCircle } from '@mui/icons-material';
import { AppBar, Button, ButtonGroup, Container, Grid, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';

import { homePath, lessonPath, relationPath } from '../../utils/paths';
import AuthModal from './AuthModal';
import { getAllLessons } from '../../services/urls';
import LessonListDialog from '../lesson/LessonList';


function Header() {

  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState( false );
 
  const [openAuthModal, setOpenAuthModal] = useState( false );
  const [openLessonListDialog, setOpenLessonListDialog] = useState( false );

  const [anchorElUser, setAnchorElUser] = useState();
  const refUserSettings = useRef();

  const [anchorElRelations, setAnchorElRelations] = useState();
  const refRelations = useRef();

  const [anchorElLessons, setAnchorElLessons] = useState();
  const refLessons = useRef();

  const [lessons, setLessons] = useState([]);
  const [relations, setRelations] = useState([]);

  const handleProfile = () => {
  };

  const handleLogout = useCallback(()=> {
    localStorage.clear();
    setIsLogged(false);
    navigate( homePath );
  },[navigate])


  const handleCreateLesson = useCallback(()=>{
      if( localStorage.getItem('user')?.uuid  ) {
          navigate(lessonPath);
      }
      else  {
          setOpenAuthModal(true);
      }
  },[navigate])

  const handleViewLessons = useCallback(async()=>{
      const fetchedLessons = await getAllLessons();
      setLessons(fetchedLessons);
      setOpenLessonListDialog(true);
  },[]);

  const handleCreateRelation = useCallback(()=>{
      if( localStorage.getItem('user')?.uuid  ) {
          navigate(relationPath);
      }
      else  {
          setOpenAuthModal(true);
      }
  },[navigate]);

  useEffect(() => {
    setIsLogged( localStorage.getItem('user')?.uuid  );
    setAnchorElUser();
  }, [openAuthModal,navigate]);

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
            <Stack direction="row" justifyContent="flex-start" alignItems="center">
            <Button 
                ref={refRelations}
                onClick={()=>setAnchorElRelations(refRelations.current)}
              >
                <Typography
                  variant="h6"
                  component="div"
                  color="secondary"
                >
                  Relations
                </Typography>
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElRelations}
                open={Boolean(anchorElRelations)}
                onClose={()=>setAnchorElRelations()}
              >
                <MenuItem onClick={handleCreateRelation}>Create Relation</MenuItem>
                <MenuItem >View Relations</MenuItem>
              </Menu>
              <Button 
                ref={refLessons}
                onClick={()=>setAnchorElLessons(refLessons.current)}
              >
                <Typography
                  variant="h6"
                  component="div"
                  color="secondary"
                >
                  Lessons
                </Typography>
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElLessons}
                open={Boolean(anchorElLessons)}
                onClose={()=>setAnchorElLessons()}
              >
                <MenuItem onClick={handleCreateLesson}>Create Lesson</MenuItem>
                <MenuItem onClick={handleViewLessons}>View Lessons</MenuItem>
              </Menu>
          </Stack>
          {isLogged 
            ? 
              <Grid container justifyContent="flex-end">
                <IconButton
                  ref={refUserSettings}
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={()=>setAnchorElUser(refUserSettings.current)}
                  color="secondary"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorElUser={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={()=>setAnchorElUser()}
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
                      setOpenAuthModal(true);
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
        open={openAuthModal}
        onClose={()=>{
          setOpenAuthModal(false)
        }}
      />
      <LessonListDialog
          open={openLessonListDialog}
          setOpen={setOpenLessonListDialog}
          onClose={()=>setOpenLessonListDialog(false)}
          lessons={lessons}
      />
    </div>
  );
}

export default Header;
