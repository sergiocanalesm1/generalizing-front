import { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHookstate } from "@hookstate/core";
import { Delete, Edit } from "@mui/icons-material";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";

import { lessonsState, tagsState, userState } from "../../globalState/globalState";
import { deleteLesson } from "../../services/lessons_services";
import { toDate } from "../../utils/dates";
import { filterByOwned, shuffle, sortByLatest } from "../../utils/filters";
import { homePath, lessonPath } from "../../utils/paths";
import { capitalizeFirstLetter, stringAvatar } from "../../utils/strings";
import ConfirmModal from "../components/ConfirmModal";
import FeedbackDialog from "../components/FeedbackDialog";
import LessonDetailDialog from "./LessonDetail";

const styles = {
    lessonList:{ 
        width: '100%',
        bgcolor: 'background.paper',
        pt:0
    },
    lessonListItem:{
        '&:hover': {
            opacity:"0,5"
        }
    }
};

const lessonsSortObj = {
    random: "RANDOM",
    mine: "MINE",
    latest: "LATEST"
}


function LessonListDialog({open, setOpen, onClose, canChoose, setChosenLesson}) {

    const navigate = useNavigate();

    const lessons = useHookstate(lessonsState);
    const user = useHookstate(userState);
    const tags = useHookstate(tagsState);

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState();
    const [lessonsFilterCriteria, setLessonsFilterCriteria] = useState( lessonsSortObj.random );
    const [proxyLessons, setProxyLessons] = useState([]);
    const [latestLessons, setLatestLessons] = useState([]);
    const [ownedLessons, setOwnedLessons] = useState([]);

    const [success, setSuccess] = useState(true);
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(()=>{});


    const handleOpenDetail = useCallback( lesson => {
        if( canChoose ) {
            setChosenLesson(lesson);
            setOpen(false);
        }
        else{
            setOpen(false);
            setOpenDetail(true);
            setSelectedLesson(lesson);
        }
    },[setOpen, setChosenLesson, canChoose]);

    const handleDetailClose = useCallback(()=>{
        setOpenDetail(false);
        setOpen(true);
    },[setOpen])

    const handleEdit = useCallback(( lesson ) =>  {
        setOpen(false);
        navigate( lessonPath, {
            state:{ lesson }
        })
    },[navigate,setOpen])


    const handleDelete = useCallback(( uuid ) =>  {
        setOpenConfirmModal(true);
        setConfirmCallback( () => () => {
            deleteLesson( uuid )
                .then( ok => {
                    if( !ok ){
                        setSuccess(false);
                    }
                    setOpenConfirmModal(false);
                    setOpenFeedbackDialog(true);
                    if( ok ){
                        navigate( homePath );
                    }
                }
            )}
        );
    },[navigate])

    const handlelessonsSortClick = useCallback((criteria) => {
        setLessonsFilterCriteria(criteria);
        let sortedLessons = {};

        switch( criteria ){
            case lessonsSortObj.random:
                sortedLessons = {}
                const shuffledIds = shuffle( Object.keys( lessons.get() ) );
                shuffledIds.forEach( id => {
                    sortedLessons[id] = lessons.get()[id];
                })
                setProxyLessons(sortedLessons);
                break;
            case lessonsSortObj.mine:
                if( ownedLessons.length === 0 ){ //if lessons havent been cached
                    sortedLessons = {}
                    sortedLessons = filterByOwned( lessons.get(), user.get().uid );
                    setOwnedLessons(sortedLessons);
                    setProxyLessons(sortedLessons);
                }
                else{
                    setProxyLessons(ownedLessons)
                }
                break;
            
            case lessonsSortObj.latest:
                if( latestLessons.length === 0 ){
                    sortedLessons = {}
                    const temp = Object.keys(lessons.get()).map( id => ({ ...lessons.get()[id], id:id }));
                    temp.sort(sortByLatest);
                    temp.forEach( element => {
                        sortedLessons[ element.id ] = element
                    })
                    setLatestLessons(sortedLessons);
                    setProxyLessons(sortedLessons);
                }
                else{
                    setProxyLessons(latestLessons);;
                }
                break;
            default:
                break;
        }
    },[lessons, latestLessons, ownedLessons])

    const handleClose = useCallback(()=>{
        setLessonsFilterCriteria(lessonsSortObj.random);//random?
        onClose()
    },[onClose])

    useEffect(()=>{
        handlelessonsSortClick(lessonsSortObj.random)
    },[open,handlelessonsSortClick])


    return(
        <div>
            <Dialog
                scroll="paper"
                open={open}
                onClose={handleClose}
                fullWidth
            >
                <DialogTitle>
                    <div>
                        <Typography variant="h3">
                            View Lessons
                        </Typography>
                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                            {   lessons.get() &&
                                Object.keys(lessonsSortObj).map( ls => (
                                    lessonsSortObj[ls] === lessonsSortObj.mine && !user.get().uid
                                    ? <></>
                                    :
                                    <Button
                                        key={ls}
                                        sx={{ borderRadius: 28 }}
                                        size="small"
                                        color="neutral"
                                        variant={ lessonsSortObj[ls] === lessonsFilterCriteria ? "contained" :"outlined" }
                                        disableElevation
                                        onClick={() => handlelessonsSortClick( lessonsSortObj[ls]) }
                                    >
                                        {lessonsSortObj[ls]}    
                                    </Button>
                                ))
                            }
                        </Stack>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <List sx={styles.lessonList}>
                        {/* proxyLessons.map(id=>( */}
                        
                        { Object.keys(proxyLessons).map( id =>{
                            const lesson = proxyLessons[id];
                            return (
                                <Grid
                                    key={id}
                                    container
                                    spacing={3}
                                    alignItems="center"
                                >
                                    <Grid item xs={10}>
                                        <ListItemButton
                                            key={id}
                                            disableGutters
                                            onClick={()=>handleOpenDetail(lesson)}
                                            sx={styles.lessonListItem}
                                        >
                                            <ListItemAvatar>
                                                {
                                                    lesson.fileName
                                                    ? <Avatar src={`${process.env.REACT_APP_BUCKET}/${lesson.fileName}`} />
                                                    : <Avatar {...stringAvatar(lesson.title)} />
                                                }
                                                
                                            </ListItemAvatar>
                                            <ListItemText  primary={lesson.title} secondary={ 
                                                <Fragment>
                                                    {lesson.tags && lesson.tags.map( tagId => capitalizeFirstLetter(tags.get()[tagId].tag) ).join(', ')}
                                                    {lesson.tags && <br />}
                                                    {toDate(lesson.creationDate)}
                                                </Fragment>
                                            }/>
                                        </ListItemButton>

                                    </Grid>
                                    {
                                        lesson.userUid === user.get().uid &&
                                            <Grid item xs={2}>
                                                <IconButton
                                                    edge="end" 
                                                    sx={{ color: 'gray' }}
                                                    onClick={() => handleEdit(lesson)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    edge="end" 
                                                    sx={{ color: 'gray' }}
                                                    onClick={() => handleDelete(lesson.uuid)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Grid>
                                    }
                                </Grid>
                        )})}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <LessonDetailDialog
                open={openDetail}
                lesson={selectedLesson}
                onClose={handleDetailClose}
            />
            <ConfirmModal
                open={openConfirmModal}
                setOpen={setOpenConfirmModal}
                callback={confirmCallback}
            />

            <FeedbackDialog
                success={success}
                open={openFeedbackDialog}
                onClose={()=>{
                    setOpenFeedbackDialog(false)
                    if( success ){
                        setOpen(false);
                    }
                }}
            />
        </div>
        
    )
}

export default LessonListDialog;