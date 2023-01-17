import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, CircularProgress, Grid, Stack, Toolbar } from "@mui/material";
import { AddCircleOutline, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useHookstate } from '@hookstate/core';

import { lessonPath, relationPath } from "../../utils/paths";
import { getFirstTimer } from "../../utils/user";
import { dbState, lessonsState, relationsState, domainsState, tagsState, originsState, userState, relationsToListState, updatingOrCreatingObjectState } from "../../globalState/globalState";
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
import { combineLessonsWithRelations } from "../../helpers/lessons_helper";
// Const t_relations =  tempRelations()

const homeStyles = {
    arrows:{width: 80,height: 80}
}
function Home() {
    
    const navigate = useNavigate();

    const lessons = useHookstate(lessonsState);
    const relations = useHookstate(relationsState);
    const domains = useHookstate(domainsState);
    const tags = useHookstate(tagsState);
    const origins = useHookstate(originsState);
    const user = useHookstate(userState);
    const fbDB = useHookstate(dbState);
    const relationsToList = useHookstate(relationsToListState);
    const updatingOrCreatingObject = useHookstate(updatingOrCreatingObjectState);


    const [success, setSuccess] = useState( false );
    const [fetching, setFetching] = useState( true );
    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
    const [openRelationListDialog, setOpenRelationListDialog] = useState( false );
    const [openHelpDialog, setOpenHelpDialog] = useState( false );
    const[openWelcomingDialog,setOpenWelcomingDialog] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState(1); // Better with strings?


    const [relationsFilters, setRelationsFilters] = useState("");
    const [path,setPath] = useState("");


    const handleCreateLesson = useCallback(()=>{
        if( user.get().uid ) {
            navigate(lessonPath);
            updatingOrCreatingObject.set({
                object:{},
            })
        }
        else  {
            setOpenAuthModal(true);
            setPath(lessonPath);
        }
    },[navigate, user, updatingOrCreatingObject])

    const handleCreateRelation = useCallback(()=>{
        if( user.get().uid ) {
            navigate(relationPath);
            updatingOrCreatingObject.set({
                object:{},
            })
        }
        else  {
            setOpenAuthModal(true);
            setPath(relationPath);
        }
    },[navigate, user, updatingOrCreatingObject]);

    useEffect(()=>{
        let isMounted = true; 

        setFetching(true);

        if( !getFirstTimer() ){
            setOpenWelcomingDialog(true);
        }
        
        const db = fbDB.get();
        // TODO fix state
        getAllRelations(db).then( fetchedRelations => {         
            getAllLessons(db).then( fetchedLessons => {
                getAllDomains(db).then( fetchedDomains => {
                    getAllTags(db).then( fetchedTags => {
                        getAllOrigins(db).then( fetchedOrigins => {
                            fetchedLessons = combineLessonsWithRelations(fetchedRelations, fetchedLessons);
                            if( isMounted ){
                                relations.set(fetchedRelations)
                                domains.set(fetchedDomains)
                                tags.set(fetchedTags)
                                origins.set(fetchedOrigins) 
                                lessons.set(fetchedLessons)
                                relationsToList.set(Object.keys(relations));
                                setFetching(false);

                            }
                        })
                    })
                })
            })
        })
        
        return () => { 
            isMounted = false 
        }
    },[]);

    return (
        <>
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
                    </Grid>
                    {   fetching
                        ? 
                            <div>
                                <Toolbar />
                                <Stack direction="row" justifyContent="center">  <CircularProgress /> </Stack>
                            </div>

                        : 
                        
                            <div>
                                { selectedGraph === 1 
                                ?
                                    <RelationGraph 
                                        setOpenList={setOpenRelationListDialog}
                                        setFilters={setRelationsFilters}
                                    />
                                :
                                    <ArrowBackIos 
                                        color="primary" 
                                        sx={homeStyles.arrows}
                                        onClick={()=> setSelectedGraph(1) }
                                    />
                                }
                        </div>

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
                <>
                    <LessonListDialog
                        open={openLessonListDialog}
                        setOpen={setOpenLessonListDialog}
                        onClose={()=>setOpenLessonListDialog(false)}
                    />
                    <RelationListDialog
                        open={openRelationListDialog}
                        setOpen={setOpenRelationListDialog}
                        filters={relationsFilters}
                        filterType="Domains"
                        onClose={()=>setOpenRelationListDialog(false)}
                    />
                </>

            }
        </>       
    );
}
  
export default Home;