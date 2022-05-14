import { useNavigate } from "react-router-dom";

import { useCallback, useEffect, useState } from "react";

import { Box, Button, CircularProgress, Grid, Stack, Toolbar } from "@mui/material";
import { AddCircleOutline, Attractions } from '@mui/icons-material';

import { lessonPath, relationPath } from "../../utils/paths";
import AuthModal from "../components/AuthModal";
import LessonListDialog from "../lesson/LessonList";
import RelationGraph from "./components/RelationGraph";
import RelationListDialog from "../relation/RelationList";
import { getFirstTimer, getUserId, setFirstTimer } from "../../utils/user";
import ChallengeDetailDialog from "../challenge/ChallengeDetail";
import FeedbackDialog from "../components/FeedbackDialog";
import { getAllRelations } from "../../services/relations_services";
import { getAllLessons } from "../../services/lessons_services";
import { getLastChallenge } from "../../services/challenges_services";
import WelcomingDialog from "../components/Welcoming";
import HelpDialog from "../components/HelpDialog";
//import { tempLasChallenge, tempRelations } from "../../utils/enums";
//const t_relations =  tempRelations()

  
function Home() {
    
    const navigate = useNavigate();

    const [success, setSuccess] = useState( false );
    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
    const [openRelationListDialog, setOpenRelationListDialog] = useState( false );
    const [openChallengeDetailDialog, setOpenChallengeDetailDialog] = useState( false );
    const [openHelpDialog, setOpenHelpDialog] = useState( false );

    const[openWelcomingDialog,setOpenWelcomingDialog] = useState(false);

    const [lessons, setLessons] = useState([]);
    const [relations, setRelations] = useState([]);
    const [lastChallenge, setLastChallenge] = useState({});

    //this temp variable is used so that the d3 graph does not get rendered constantly
    const [relationsToShow, setRelationsToShow] = useState([]);
    const [relationsFilters, setRelationsFilters] = useState("");

    const [path,setPath] = useState("");



    const handleCreateLesson = useCallback(()=>{
        if( Boolean( getUserId() ) ) {
            navigate(lessonPath);
        }
        else  {
            setOpenAuthModal(true);
            setPath(lessonPath);
        }
    },[navigate])

    const handleCreateRelation = useCallback(()=>{
        if( Boolean( getUserId() ) ) {
            navigate(relationPath);
        }
        else  {
            setOpenAuthModal(true);
            setPath(relationPath);
        }
    },[navigate]);

    const handleViewChallenge = useCallback(()=>{
        setOpenChallengeDetailDialog(true);
    },[])

    useEffect(()=>{
        if( !getFirstTimer() ){
            setOpenWelcomingDialog(true);
        }
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
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        sx={{marginTop:2}}
                        spacing={1}
                    >
                        <Grid item xs={12} md={1}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => setOpenHelpDialog(true)}
                            >
                                WTF
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<AddCircleOutline />}
                                onClick={handleCreateLesson}
                            >
                                Add Lesson
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button 
                                fullWidth
                                variant="contained"
                                startIcon={<AddCircleOutline />}
                                onClick={handleCreateRelation}
                            >
                                Create Relation
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            {
                                lastChallenge &&
                                <Button
                                fullWidth
                                    variant="contained"
                                    startIcon={<Attractions />}
                                    onClick={handleViewChallenge}
                                >
                                    Challenge
                                </Button>
                            }
                        </Grid>
                    </Grid>
                    {   relations.length > 0 & lessons.length > 0
                        ? <Box>
                            <RelationGraph 
                                relations={relations} 
                                setOpenList={setOpenRelationListDialog}
                                setRelationsToShow={setRelationsToShow}
                                setFilters={setRelationsFilters}
                            />
                            <Toolbar />
                          </Box>
                        : <Stack direction="row" justifyContent="center"> <CircularProgress /> </Stack>
                    }
                </Box>
            </Box>
            <AuthModal
                open={openAuthModal}
                onClose={()=>{
                    setOpenAuthModal(false)
                }}
                onSuccess={()=>{
                    setOpenAuthModal(false)
                    setSuccess(true);
                    setOpenFeedbackDialog(true);
                    navigate(path);
                }}
                onError={()=>{
                    setSuccess(false);
                    setOpenFeedbackDialog(true);
                }}
            />
            <FeedbackDialog
                success={success}
                open={openFeedbackDialog}
                onClose={()=>{
                    setOpenFeedbackDialog(false)
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
            <WelcomingDialog
                open={openWelcomingDialog}
                onClose={()=>{
                    setFirstTimer();
                    setOpenWelcomingDialog(false)
                }}
            />
            <HelpDialog
                open={openHelpDialog}
                onClose={()=>setOpenHelpDialog(false)}
                lessons={lessons}
                relations={relations}
            />
        </div>       
    );
}
  
export default Home;