/* eslint-disable no-negated-condition */
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, CircularProgress, Grid, Stack, Toolbar } from "@mui/material";
import { AddCircleOutline, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useHookstate } from '@hookstate/core';

import { lessonPath, relationPath } from "../../utils/paths";
import { getFirstTimer } from "../../utils/user";
import { lessonsState, relationsState, userState, updatingOrCreatingObjectState } from "../../globalState/globalState";
import AuthModal from "../components/AuthModal";
import HelpDialog from "../components/HelpDialog";
import FeedbackDialog from "../components/FeedbackDialog";
import WelcomingDialog from "../components/Welcoming";
import LessonListDialog from "../lesson/LessonList";
import RelationListDialog from "../relation/RelationList";
import useWindowDimensions from "../../utils/hooks";
import RelationsDomainsGraph from "./components/graphs/RelationsDomainsGraph";
import RelationsOriginsGraph from "./components/graphs/RelationsOriginsGraph";


const homeStyles = {
    graphContainer:{
        width: '100vw',
        height: '70vh',
        position: 'relative'
    },
    graph:{
        width: '100%',
        height: '100%',
        position:"absolute",
        margin: 'auto'
    }
}

function Home() {
    
    const navigate = useNavigate();

    const relations = useHookstate(relationsState);
    const user = useHookstate(userState);
    const updatingOrCreatingObject = useHookstate(updatingOrCreatingObjectState);


    const [success, setSuccess] = useState( false );
    const [openAuthModal, setOpenAuthModal] = useState( false );
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openLessonListDialog, setOpenLessonListDialog] = useState( false );
    const [openRelationListDialog, setOpenRelationListDialog] = useState( false );
    const [openHelpDialog, setOpenHelpDialog] = useState( false );
    const[openWelcomingDialog,setOpenWelcomingDialog] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState(1); // Better with strings?
    const [filterType, setFilterType] = useState("Origins");// CHANGE


    const [relationsFilters, setRelationsFilters] = useState("");
    const [path,setPath] = useState("");

    const {height, width} = useWindowDimensions();

    useEffect( () => {
        if( selectedGraph === 1 ){
            setFilterType("Domains")
        }
        else if( selectedGraph === 2 ){
            setFilterType("Origins")
        }
    },[selectedGraph])

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
     if( !getFirstTimer() ){
         setOpenWelcomingDialog(true);
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
                    {   !lessonsState.get()
                        ? 
                            <div>
                                <Toolbar />
                                <Stack direction="row" justifyContent="center">  <CircularProgress /> </Stack>
                            </div>

                        : 
                            <div>
                                { selectedGraph === 1 
                                ?
                                    <div style={homeStyles.graphContainer}>
                                        <RelationsDomainsGraph 
                                            setOpenList={setOpenRelationListDialog}
                                            setFilters={setRelationsFilters}
                                            sx={homeStyles.graph}
                                        />  
                                        <ArrowForwardIos
                                            color="primary" 
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                zIndex: 'tooltip',
                                                top: height / 2 - 80,
                                                right: '3%',
                                                position:"absolute",
                                            }}
                                            onClick={()=> setSelectedGraph(2) }
                                        />
                                    </div>
                                :
                                    <div style={homeStyles.graphContainer}>
                                        <Toolbar />
                                        <RelationsOriginsGraph
                                            setOpenList={setOpenRelationListDialog}
                                            setFilters={setRelationsFilters}
                                            sx={homeStyles.graph}
                                        /> 
                                        <ArrowBackIos 
                                            color="primary" 
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                zIndex: 'tooltip',
                                                top: height / 2 - 80,
                                                left: '3%',
                                                position:"absolute",
                                            }}
                                            onClick={()=> setSelectedGraph(1) }
                                        />
                                    </div>
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
                relations.get() &&
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
                        filterType={filterType}
                        onClose={()=>setOpenRelationListDialog(false)}
                    />
                </>

            }
        </>       
    );
}
  
export default Home;