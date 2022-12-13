import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountCircle, HelpOutline } from '@mui/icons-material';
import { AppBar, Button, ButtonGroup, CardMedia, Container, Grid, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import { useHookstate } from '@hookstate/core';

import { homePath, lessonPath, relationPath } from '../../utils/paths';
import AuthModal from './AuthModal';
import LessonListDialog from '../lesson/LessonList';
import RelationListDialog from '../relation/RelationList';
import { clearUser } from '../../utils/user';
import FeedbackDialog from './FeedbackDialog';
import HelpDialog from './HelpDialog';
import { lessonsState, relationsState, userState } from '../../globalState/globalState';
//import { tempRelations } from '../../utils/enums';


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

  const relations = useHookstate(relationsState);
  const user = useHookstate(userState);

  const [path,setPath] = useState("");


  const handleLogout = useCallback(()=> {
    user.set({});
    navigate( homePath );
  },[navigate])

  const handleCreateLesson = useCallback(()=>{
    setAnchorElLessons();
    console.log(user.get().userUid)
    if( user.get().userUid ) {
      navigate(lessonPath);
    }
    else  {
        setPath(lessonPath);
        setOpenAuthModal(true);
    }

  },[navigate])

  const handleViewLessons = useCallback(async()=>{
    setAnchorElLessons();
    setOpenLessonListDialog(true);
  },[]);

  const handleCreateRelation = useCallback(()=>{
    setAnchorElRelations();
    if( user.get().userUid ) {
        navigate(relationPath);
    }
    else  {
        setPath(relationPath);
        setOpenAuthModal(true);
    }
  },[navigate]);

  const handleViewRelations = useCallback(async()=>{
    setAnchorElRelations();
    setOpenRelationListDialog(true);
  },[])

  useEffect(() => {

    setAnchorElUser();
  }, [openAuthModal,navigate]);

  return (
    <div>
      <AppBar position="fixed">
        <Container maxWidth={false}>
          <Toolbar>
            <Button 
              onClick={()=>navigate(homePath)}
              sx={{
                pr:5,
                maxWidth:450
                
              }}>
              <CardMedia
                component="img"
                image="https://generalizing-test-bucket.s3.us-east-2.amazonaws.com/Logo-blue.png"
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
          {user.get().userUid 
            ? 
              <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item container xs={8} md={1} justifyContent="flex-end">
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
                    anchorEl={anchorElUser}
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
                    <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                  </Menu>
                </Grid>
                <Grid item xs={4} md={1} justifyContent="flex-start">
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={()=>setOpenHelpDialog(true)}
                    color="secondary"
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
          relations={relations}
      />
      <HelpDialog
        open={openHelpDialog}
        onClose={()=>setOpenHelpDialog(false)}
        relations={relations}
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
