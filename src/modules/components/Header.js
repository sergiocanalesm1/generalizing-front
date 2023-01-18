import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountCircle, HelpOutline } from '@mui/icons-material';
import { AppBar, Button, ButtonGroup, CardMedia, Container, Grid, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import { useHookstate } from '@hookstate/core';

import { homePath, lessonPath, relationPath } from '../../utils/paths';
import AuthModal from './AuthModal';
import LessonListDialog from '../lesson/LessonList';
import RelationListDialog from '../relation/RelationList';
import FeedbackDialog from './FeedbackDialog';
import HelpDialog from './HelpDialog';
import { filtersState, lessonsState, lessonsToListState, relationsState, relationsToListState, updatingOrCreatingObjectState, userState } from '../../globalState/globalState';
import { logout } from '../../services/user_services';
// Import { tempRelations } from '../../utils/enums';


function Header() {

  const navigate = useNavigate();
 
  const [openAuthModal, setOpenAuthModal] = useState( false );
  const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
  const [openRelationListDialog, setOpenRelationListDialog] = useState( false );
  const [success, setSuccess] = useState( false );
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState( false );

  const [anchorElUser, setAnchorElUser] = useState();
  const refUserSettings = useRef();

  const [anchorElRelations, setAnchorElRelations] = useState();
  const refRelations = useRef();

  const [anchorElLessons, setAnchorElLessons] = useState();
  const refLessons = useRef();

  const user = useHookstate(userState);
  const relations = useHookstate(relationsState);
  const lessons = useHookstate(lessonsState)
  const relationsToList = useHookstate(relationsToListState);
  const lessonsToList = useHookstate(lessonsToListState);
  const updatingOrCreatingObject = useHookstate(updatingOrCreatingObjectState);

  const [path,setPath] = useState("");


  const handleLogout = useCallback(()=> {
    logout(); // State is cleared in the observer
    navigate( 0 );
  },[navigate])

  const handleCreateLesson = useCallback(()=>{
    setAnchorElLessons();
    if( user.get()?.uid ) {
      updatingOrCreatingObject.set({
        object:{}
    })
      navigate(lessonPath);
    }
    else  {
        setPath(lessonPath);
        setOpenAuthModal(true);
    }

  },[navigate, user, updatingOrCreatingObject])

  const handleViewLessons = useCallback(()=>{
    filtersState.set("");
    lessonsToList.set(Object.keys(lessons));
    setAnchorElLessons();
    setOpenLessonListDialog(true);
  },[lessonsToList, lessons]);

  const handleCreateRelation = useCallback(()=>{
    setAnchorElRelations();
    if( user.get()?.uid ) {
      updatingOrCreatingObject.set({
        object:{}
    })
        navigate(relationPath);
    }
    else  {
        setPath(relationPath);
        setOpenAuthModal(true);
    }
  },[navigate, user, updatingOrCreatingObject]);

  const handleViewRelations = useCallback(()=>{
    filtersState.set("");
    relationsToList.set(Object.keys(relations));
    setAnchorElRelations();
    setOpenRelationListDialog(true);
  },[relationsToList, relations])

  useEffect(() => {
      setAnchorElUser();
  }, [openAuthModal,navigate]);

  return (
    <div>
      <AppBar position="fixed">
        <Container maxWidth={false}>
          <Toolbar>
            <Button 
              sx={{
                pr:5,
                maxWidth:450
                
              }}
              onClick={()=>navigate(homePath)}>
              <CardMedia
                component="img"
                image={`${process.env.REACT_APP_BUCKET}/Logo-blue.png`}
                alt="generalizing-logo"
              />
            </Button>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" 
              sx={{
                display:{
                  xs:'none',
                  md:'flex'
                }
              }}
            >
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
              <MenuItem onClick={handleCreateLesson}>Add Lesson</MenuItem>
              <MenuItem onClick={handleViewLessons}>View Lessons</MenuItem>
            </Menu>
            <Button 
                ref={refRelations}
                onClick={()=>setAnchorElRelations(refRelations.current)}
              >
                <Typography
                  variant="h6"
                  component="span"
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
              <MenuItem onClick={handleViewRelations}>View Relations</MenuItem>
            </Menu>
          </Stack>
          {user.get()?.uid
            ? 
              <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item container xs={8} md={1} justifyContent="flex-end">
                  <IconButton
                    ref={refUserSettings}
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="secondary"
                    onClick={()=>setAnchorElUser(refUserSettings.current)}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    keepMounted
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={()=>setAnchorElUser()}
                  >
                    <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                  </Menu>
                </Grid>
                <Grid item xs={4} md={1} justifyContent="flex-start">
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="secondary"
                    onClick={()=>setOpenHelpDialog(true)}
                  >
                    <HelpOutline />
                  </IconButton>
                </Grid>
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
                    Sign up | Login
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
        onSuccess={()=>{
          setOpenAuthModal(false)
          setSuccess(true);
          setOpenFeedbackDialog(true);
        }}
        onError={()=>{
          setSuccess(false);
          setOpenFeedbackDialog(true);
        }}
      />
      <LessonListDialog
          open={openLessonListDialog}
          setOpen={setOpenLessonListDialog}
          onClose={()=>setOpenLessonListDialog(false)}
      />

      <RelationListDialog
          open={openRelationListDialog}
          setOpen={setOpenRelationListDialog}
          onClose={()=>setOpenRelationListDialog(false)}
      />
      <HelpDialog
        open={openHelpDialog}
        onClose={()=>setOpenHelpDialog(false)}
      />
      <FeedbackDialog
        success={success}
        open={openFeedbackDialog}
        onClose={()=>{
          setOpenFeedbackDialog(false);
          if( success ){
            navigate(path);
          }
        }}
      />
    </div>
  );
}

export default Header;
