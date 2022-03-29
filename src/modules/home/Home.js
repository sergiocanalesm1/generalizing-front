import { useNavigate } from "react-router-dom";

import { useCallback, useEffect, useState } from "react";

import { Box, CircularProgress, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { AddCircleOutline, VisibilityOutlined } from '@mui/icons-material';

import { lessonPath, relationPath } from "../../utils/paths";
import AuthModal from "../components/AuthModal";
import LessonListDialog from "../lesson/LessonList";
import { getAllLessons, getAllRelations } from "../../services/urls";
import RelationGraph from "./components/RelationGraph";

const drawerWidth = 240;
const styles = {
    drawer : {
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
        }
    }
}
  
function Home() {
    
    const navigate = useNavigate();

    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
    const [lessons, setLessons] = useState([]);
    const [relations, setRelations] = useState([]);


    const handleCreateLesson = useCallback(()=>{
        if( localStorage.getItem('uuid') ) {
            navigate(lessonPath);
        }
        else  {
            setOpenAuthModal(true);
        }
    },[navigate])

    const handleViewLesson = useCallback(async()=>{
        const fetchedLessons = await getAllLessons();
        setLessons(fetchedLessons);
        setOpenLessonListDialog(true);
    },[]);

    const handleCreateRelation = useCallback(()=>{
        if( localStorage.getItem('uuid') ) {
            navigate(relationPath);
        }
        else  {
            setOpenAuthModal(true);
        }
    },[navigate]);

    useEffect(()=>{
        getAllRelations().then( r => setRelations(r) );
        getAllLessons().then( l => setLessons(l) );
    },[]);

    return (
        <div>
            <Box>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    sx={styles.drawer}
                >
                    <Toolbar />
                    <List>
                        <ListItemButton onClick={handleCreateRelation}>
                            <ListItemIcon>
                                <AddCircleOutline />
                            </ListItemIcon>
                            <ListItemText primary={"Create Relation"} />
                        </ListItemButton>
                        <ListItemButton onClick={handleCreateLesson}>
                            <ListItemIcon>
                                <AddCircleOutline />
                            </ListItemIcon>
                            <ListItemText primary={"Create Lesson"} />
                        </ListItemButton>
                        <Divider  />
                        <ListItemButton >
                            <ListItemIcon>
                                <VisibilityOutlined />
                            </ListItemIcon>
                            <ListItemText primary={"View my Relations"} />
                        </ListItemButton>
                        <ListItemButton onClick={handleViewLesson}>
                            <ListItemIcon>
                                <VisibilityOutlined />
                            </ListItemIcon>
                            <ListItemText primary={"View my Lessons"} />
                        </ListItemButton>
                    </List>
                </Drawer>
                <Box>
                    <Toolbar />
                    {   relations.length > 0 & lessons.length > 0
                        ? <RelationGraph relations={relations} lessons={lessons}/>
                        : <CircularProgress />
                    }
                </Box>
            </Box>
            <AuthModal
              open={openAuthModal}
              isLogin
              onClose={()=>{
                  setOpenAuthModal(false);
                  navigate(lessonPath);
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
  
export default Home;