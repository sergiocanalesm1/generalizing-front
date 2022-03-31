import { useNavigate } from "react-router-dom";

import { useCallback, useEffect, useState } from "react";

import { Box, Button, CircularProgress, Stack, Toolbar } from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';

import { lessonPath, relationPath } from "../../utils/paths";
import AuthModal from "../components/AuthModal";
import LessonListDialog from "../lesson/LessonList";
import { getAllLessons, getAllRelations } from "../../services/urls";
import RelationGraph from "./components/RelationGraph";
import RelationListDialog from "../relation/RelationList";
import { tempRelations } from "../../utils/enums";
import { getUser } from "../../utils/user";
//const t_relations =  tempRelations()

  
function Home() {
    
    const navigate = useNavigate();

    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
    const [openRelationListDialog, setOpenRelationListDialog] = useState( false );

    const [lessons, setLessons] = useState([]);
    const [relations, setRelations] = useState([]);

    //this temp variable is used so that the d3 graph does not get rendered constantly
    const [relationsToShow, setRelationsToShow] = useState([])

    const [relationsFilters, setRelationsFilters] = useState({});


    const handleCreateLesson = useCallback(()=>{
        if( Boolean(getUser()) ) {
            navigate(lessonPath);
        }
        else  {
            setOpenAuthModal(true);
        }
    },[navigate])

    const handleCreateRelation = useCallback(()=>{
        if( Boolean(getUser()) ) {
            navigate(relationPath);
        }
        else  {
            setOpenAuthModal(true);
        }
    },[navigate]);

    useEffect(()=>{
        getAllRelations().then( r => {
            setRelations(r)
            setRelationsToShow(r)
        } );
        getAllLessons().then( l => setLessons(l) );
        
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
                    {   relations.length > 0 & lessons.length > 0
                        ? <RelationGraph 
                            relations={relations} 
                            setOpenList={setOpenRelationListDialog}
                            setRelationsToShow={setRelationsToShow}
                            setFilters={setRelationsFilters}
                          />
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
            <RelationListDialog
                open={openRelationListDialog}
                setOpen={setOpenRelationListDialog}
                onClose={()=>setOpenRelationListDialog(false)}
                relations={relationsToShow}
                filters={relationsFilters}
            />
        </div>       
    );
}
  
export default Home;