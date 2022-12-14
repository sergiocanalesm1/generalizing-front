import { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, CircularProgress, Grid, Stack, Toolbar } from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';
import { useHookstate } from '@hookstate/core';

import { lessonPath, relationPath } from "../../utils/paths";
import { getFirstTimer } from "../../utils/user";
import { db, lessonsState, relationsState, domainsState, tagsState, originsState, userState, relationsToListState } from "../../globalState/globalState";
import { fetchData } from "../../helpers/data_helper";
import AuthModal from "../components/AuthModal";
import HelpDialog from "../components/HelpDialog";
import RelationGraph from "./components/RelationGraph";
import FeedbackDialog from "../components/FeedbackDialog";
import WelcomingDialog from "../components/Welcoming";
import LessonListDialog from "../lesson/LessonList";
import RelationListDialog from "../relation/RelationList";
import { getAllRelations } from "../../services/relations_services";
import { getAllLessons } from "../../services/lessons_services";
import { getAllDomains } from "../../services/domains_services";
import { getAllTags } from "../../services/tags_services";
import { getAllOrigins } from "../../services/origins_services";
import { combineLessonsWithRelations, setupLessons } from "../../helpers/lessons_helper";
//import ChallengeDetailDialog from "../challenge/ChallengeDetail";
// import { getLastChallenge } from "../../services/challenges_services";
//import { tempLasChallenge, tempRelations } from "../../utils/enums";
//const t_relations =  tempRelations()

  
function Home() {
    
    const navigate = useNavigate();

    //const state = useHookstate(globalState);
    const lessons = useHookstate(lessonsState);
    const relations = useHookstate(relationsState);
    const domains = useHookstate(domainsState);
    const tags = useHookstate(tagsState);
    const origins = useHookstate(originsState);
    const user = useHookstate(userState);
    const fbDB = useHookstate(db);

    const relationsToList = useHookstate(relationsToListState);

    const [success, setSuccess] = useState( false );
    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
    const [openRelationListDialog, setOpenRelationListDialog] = useState( false );
    //const [openChallengeDetailDialog, setOpenChallengeDetailDialog] = useState( false );
    const [openHelpDialog, setOpenHelpDialog] = useState( false );

    const[openWelcomingDialog,setOpenWelcomingDialog] = useState(false);

    const [fetching, setFetching] = useState(true);


    //const [lastChallenge, setLastChallenge] = useState({});
    const [relationsFilters, setRelationsFilters] = useState("");

    const [path,setPath] = useState("");



    const handleCreateLesson = useCallback(()=>{
        if( Boolean( user.get().userId ) ) {
            navigate(lessonPath);
        }
        else  {
            setOpenAuthModal(true);
            setPath(lessonPath);
        }
    },[navigate])

    const handleCreateRelation = useCallback(()=>{
        if( Boolean( user.get().userId ) ) {
            navigate(relationPath);
        }
        else  {
            setOpenAuthModal(true);
            setPath(relationPath);
        }
    },[navigate]);


    /*
    const handleViewChallenge = useCallback(()=>{
        setOpenChallengeDetailDialog(true);
    },[])
    */
    useEffect(()=>{
        if( !getFirstTimer() ){
            setOpenWelcomingDialog(true);
        }
        
        const db = fbDB.get();
        
        getAllRelations(db).then( fetchedRelations => {         
            getAllLessons(db).then( fetchedLessons => {
                getAllDomains(db).then( fetchedDomains => {
                    getAllTags(db).then( fetchedTags => {
                        getAllOrigins(db).then( fetchedOrigins => {
                            fetchedLessons = combineLessonsWithRelations(fetchedRelations, fetchedLessons, fetchedDomains, fetchedOrigins, fetchedTags);
                            relations.set(fetchedRelations)
                            domains.set(fetchedDomains)
                            tags.set(fetchedTags)
                            origins.set(fetchedOrigins) 
                            lessons.set(fetchedLessons)
                            relationsToList.set(Object.keys(relations))
                            setFetching(false)
                        })
                    })
                })
            })
        })
        
            /*
            getLastChallenge().then( c => {
                const updatedLessons = combineLessonsWithRelations(r, [c.lesson_1, c.lesson_2]);
                c.lesson_1 = updatedLessons[0];
                c.lesson_2 = updatedLessons[1];
                setLastChallenge(c);
                
            });
            */
    },[]);
    return (
        <Fragment>
            <Box>
                <Box>
                    <Toolbar />
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            '@media only screen and (max-width: 600px)': {
                                p:1,
                                mt:0,
                            },
                            mt:2
                        }}
                        spacing={1}
                    >
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => setOpenHelpDialog(true)}
                            >
                                WTF
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<AddCircleOutline />}
                                onClick={handleCreateLesson}
                            >
                                Add Lesson
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button 
                                fullWidth
                                variant="contained"
                                startIcon={<AddCircleOutline />}
                                onClick={handleCreateRelation}
                            >
                                Create Relation
                            </Button>
                        </Grid>
                        {/*
                            <Grid item xs={12} md={3}>
                                {
                                    lastChallenge &&
                                    <Button
                                    fullWidth
                                        variant="contained"
                                        startIcon={<Attractions />}
                                        onClick={handleViewChallenge}
                                    >
                                        Challenge of the Week
                                    </Button>
                                }
                            </Grid>
                        */}
                    </Grid>
                    {   !fetching
                        ? <Box>
                            <RelationGraph 
                                setOpenList={setOpenRelationListDialog}
                                setFilters={setRelationsFilters}
                            />
                            <Toolbar />
                        </Box>
                        : <>{
                            <div>
                                <Toolbar />
                                <Stack direction="row" justifyContent="center">  <CircularProgress /> </Stack>
                            </div>
                            }</>
                    }
                </Box>
                <Toolbar />
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
            <WelcomingDialog
                open={openWelcomingDialog}
                onClose={()=>{
                    setOpenWelcomingDialog(false)
                }}
            />
            <HelpDialog
                open={openHelpDialog}
                onClose={()=>setOpenHelpDialog(false)}
            />
            {
                !fetching &&
                <Fragment>
                    <LessonListDialog
                        open={openLessonListDialog}
                        setOpen={setOpenLessonListDialog}
                        onClose={()=>setOpenLessonListDialog(false)}
                    />
                    <RelationListDialog
                        open={openRelationListDialog}
                        setOpen={setOpenRelationListDialog}
                        onClose={()=>setOpenRelationListDialog(false)}
                        filters={relationsFilters}
                        filterType={'Domains'}
                    />
                </Fragment>

            }
            {/*   lastChallenge &&
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
            */}
        </Fragment>       
    );
}
  
export default Home;