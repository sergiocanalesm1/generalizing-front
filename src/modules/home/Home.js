import { useNavigate } from "react-router-dom";

import { useCallback, useEffect, useState } from "react";

import { Box, Button, CircularProgress, Stack, Toolbar } from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';

import { lessonPath, relationPath } from "../../utils/paths";
import AuthModal from "../components/AuthModal";
import LessonListDialog from "../lesson/LessonList";
import { getAllLessons, getAllRelations } from "../../services/urls";
import RelationGraph from "./components/RelationGraph";

const drawerWidth = 240;
/*
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
*/

  
function Home() {
    
    const navigate = useNavigate();

    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
    const [lessons, setLessons] = useState([]);
    const [relations, setRelations] = useState([]);


    const handleCreateLesson = useCallback(()=>{
        if( localStorage.getItem('user')?.uuid  ) {
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
        if( localStorage.getItem('user')?.uuid  ) {
            navigate(relationPath);
        }
        else  {
            setOpenAuthModal(true);
        }
    },[navigate]);

    useEffect(()=>{
        //getAllRelations().then( r => setRelations(r) );
        //getAllLessons().then( l => setLessons(l) );
    },[]);

    return (
        <div>
            <Box>
                <Box>
                    <Toolbar />
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        sx={{m:2}}
                    >
                        <Button 
                            variant="contained"
                            startIcon={<AddCircleOutline />}
                            onClick={handleCreateRelation}
                        >
                            Add Relation
                        </Button>
                        <Button 
                            variant="contained"
                            startIcon={<AddCircleOutline />}
                            onClick={handleCreateLesson}
                        >
                            Add Lesson
                        </Button>
                    </Stack>
                    <Toolbar />
                    {   relations.length > 0 & lessons.length > 0
                        ? <RelationGraph relations={relations} lessons={lessons}/>
                        : <Stack direction="row" justifyContent="center"> <CircularProgress /> </Stack>
                    }
                </Box>
            </Box>
            <AuthModal
              open={openAuthModal}
              onClose={()=>{
                  setOpenAuthModal(false);
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