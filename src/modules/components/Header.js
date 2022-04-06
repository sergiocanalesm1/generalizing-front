import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountCircle } from '@mui/icons-material';
import { AppBar, Button, ButtonGroup, Container, Grid, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';

import { homePath, lessonPath, relationPath } from '../../utils/paths';
import AuthModal from './AuthModal';
import LessonListDialog from '../lesson/LessonList';
import RelationListDialog from '../relation/RelationList';
import { clearUser, getUserUuid } from '../../utils/user';
import FeedbackDialog from './FeedbackDialog';
import { getAllRelations } from '../../services/relations_services';
import { getAllLessons } from '../../services/lessons_services';
//import { tempRelations } from '../../utils/enums';


function Header() {

  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState( false );
 
  const [openAuthModal, setOpenAuthModal] = useState( false );
  const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
  const [openRelationListDialog, setOpenRelationListDialog] = useState( false );
  const [success, setSuccess] = useState( false );
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  const [anchorElUser, setAnchorElUser] = useState();
  const refUserSettings = useRef();

  const [anchorElRelations, setAnchorElRelations] = useState();
  const refRelations = useRef();

  const [anchorElLessons, setAnchorElLessons] = useState();
  const refLessons = useRef();

  const [lessons, setLessons] = useState([]);
  const [relations, setRelations] = useState([]);

  const [path,setPath] = useState("");


  const handleLogout = useCallback(()=> {
    clearUser();
    setIsLogged(false);
    navigate( homePath );
  },[navigate])

  const handleCreateLesson = useCallback(()=>{
    if( Boolean(getUserUuid()) ) {
      navigate(lessonPath);
    }
    else  {
        setPath(lessonPath);
        setOpenAuthModal(true);
    }

  },[navigate])

  const handleViewLessons = useCallback(async()=>{
      const fetchedLessons = await getAllLessons();
      setLessons(fetchedLessons);
      setOpenLessonListDialog(true);
  },[]);

  const handleCreateRelation = useCallback(()=>{
    if( Boolean(getUserUuid()) ) {
        navigate(relationPath);
    }
    else  {
        setPath(relationPath);
        setOpenAuthModal(true);
    }
  },[navigate]);

  const handleViewRelations = useCallback(async()=>{
    const fetchedRelations = await getAllRelations();
    setRelations(fetchedRelations);
    setOpenRelationListDialog(true);
  },[])

  useEffect(() => {
    setIsLogged( Boolean(getUserUuid()) );
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
                <MenuItem onClick={handleViewRelations}>View Relations</MenuItem>
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
          lessons={lessons}
      />

      <RelationListDialog
          open={openRelationListDialog}
          setOpen={setOpenRelationListDialog}
          onClose={()=>setOpenRelationListDialog(false)}
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
