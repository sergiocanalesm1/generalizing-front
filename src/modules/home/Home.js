import { useNavigate } from "react-router-dom";

import { useCallback, useEffect, useState } from "react";

import { Box, Button, CircularProgress, Stack, Toolbar } from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';

import { lessonPath, relationPath } from "../../utils/paths";
import AuthModal from "../components/AuthModal";
import LessonListDialog from "../lesson/LessonList";
import { getAllLessons, getAllRelations, getLastChallenge } from "../../services/urls";
import RelationGraph from "./components/RelationGraph";
import RelationListDialog from "../relation/RelationList";
import { getUserUuid } from "../../utils/user";
import ChallengeGraph from "./components/ChallengeGraph";
import ChallengeDetailDialog from "../challenge/ChallengeDetail";
//import { tempLasChallenge, tempRelations } from "../../utils/enums";
//const t_relations =  tempRelations()

  
function Home() {
    
    const navigate = useNavigate();
    const [,updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
    const [openRelationListDialog, setOpenRelationListDialog] = useState( false );
    const [openChallengeDetailDialog, setOpenChallengeDetailDialog] = useState( false );

    const [lessons, setLessons] = useState([]);
    const [relations, setRelations] = useState([]);
    const [lastChallenge, setLastChallenge] = useState({});

    //this temp variable is used so that the d3 graph does not get rendered constantly
    const [relationsToShow, setRelationsToShow] = useState([]);
    const [relationsFilters, setRelationsFilters] = useState("");



    const handleCreateLesson = useCallback(()=>{
        if( Boolean(getUserUuid()) ) {
            navigate(lessonPath);
        }
        else  {
            setOpenAuthModal(true);
        }
    },[navigate])

    const handleCreateRelation = useCallback(()=>{
        if( Boolean(getUserUuid()) ) {
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
        getAllLessons().then( l => {
            setLessons(l)
        });
        getLastChallenge().then( c => {
            setLastChallenge(c)
        });
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
                        ? <div>
                            <RelationGraph 
                                relations={relations} 
                                setOpenList={setOpenRelationListDialog}
                                setRelationsToShow={setRelationsToShow}
                                setFilters={setRelationsFilters}
                            />
                            <Toolbar />
                          </div>
                        : <Stack direction="row" justifyContent="center"> <CircularProgress /> </Stack>
                    }
                    {
                        lastChallenge
                        ? <div>
                            <ChallengeGraph
                                challenge={lastChallenge}
                                setOpenDetail={setOpenChallengeDetailDialog}
                            />
                            <Toolbar />
                         </div>
                        : <Stack direction="row" justifyContent="center"> <CircularProgress /> </Stack>
                    }
                </Box>
            </Box>
            <AuthModal
              open={openAuthModal}
              onClose={()=>{
                  setOpenAuthModal(false);
                  forceUpdate();
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
            {   lastChallenge &&
                <ChallengeDetailDialog
                    open={openChallengeDetailDialog}
                    setOpen={setOpenChallengeDetailDialog}
                    onClose={()=>setOpenChallengeDetailDialog(false)}
                    challenge={lastChallenge}
                    relations={relations} 
                    setOpenList={setOpenRelationListDialog}
                    setRelationsToShow={setRelationsToShow}
                    setFilters={setRelationsFilters}
                />
            }
        </div>       
    );
}
  
export default Home;