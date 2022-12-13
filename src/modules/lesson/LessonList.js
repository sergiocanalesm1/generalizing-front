import { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHookstate } from "@hookstate/core";
import { Delete, Edit } from "@mui/icons-material";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";

import { lessonsState } from "../../globalState/globalState";
import { deleteLesson } from "../../services/lessons_services";
import { toDate } from "../../utils/dates";
import { filterByOwned, shuffle, sortByLatest } from "../../utils/filters";
import { homePath, lessonPath } from "../../utils/paths";
import { capitalizeFirstLetter, stringAvatar } from "../../utils/strings";
import { getUserId } from "../../utils/user";
import ConfirmModal from "../components/ConfirmModal";
import FeedbackDialog from "../components/FeedbackDialog";
import LessonDetailDialog from "./LessonDetail";

const styles = {
    lessonList:{ 
        width: '100%',
        bgcolor: 'background.paper'
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


//TODO fix sort
function LessonListDialog({open, setOpen, onClose, canChoose, setChosenLesson}) {

    const navigate = useNavigate();

    const lessons = useHookstate(lessonsState); //TODO change?

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState();
    const [lessonsSort, setlessonsSort] = useState( lessonsSortObj.random );
    const [proxyLessons, setProxyLessons] = useState([]);
    const [latestLessons, setLatestLessons] = useState([]);
    const [ownedLessons, setOwnedLessons] = useState([]);

    const [success, setSuccess] = useState(true);
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(()=>{});


    const handleOpenDetail = useCallback(( lesson )=>{
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

        setlessonsSort(lessonsSortObj[criteria]);
        if( lessonsSortObj[criteria] === lessonsSortObj.random ){
            //shuffle(lessons);
            setProxyLessons(lessons);
        }
        if( lessonsSortObj[criteria] === lessonsSortObj.mine ){
            if( ownedLessons.length === 0 ){
                const temp = filterByOwned(lessons);
                setOwnedLessons(temp);
                setProxyLessons(temp);
            }
            else{
                setProxyLessons(ownedLessons)
            }
        }
        if( lessonsSortObj[criteria] === lessonsSortObj.latest ){
            if( latestLessons.length === 0 ){
                const temp = lessons;
                temp.sort(sortByLatest);
                setLatestLessons(temp);
                setProxyLessons(temp);
            }
            else{
                setProxyLessons(latestLessons);
            }
        }
    },[lessons, latestLessons, ownedLessons])

    const handleClose = useCallback(()=>{
        setlessonsSort(lessonsSortObj.random);//random?
        setLatestLessons([]);
        setOwnedLessons([]);
        onClose()
    },[onClose])

    useEffect(()=>{
        if(open){
            setProxyLessons(lessons);
        }
    },[open,lessons])


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
                            {   lessons &&
                                Object.keys(lessonsSortObj).map( ls => (
                                    lessonsSortObj[ls] === lessonsSortObj.mine & !Boolean(getUserId())
                                    ? <></>
                                    :
                                    <Button
                                        key={ls}
                                        sx={{ borderRadius: 28 }}
                                        size="small"
                                        color="neutral"
                                        variant={ lessonsSortObj[ls] === lessonsSort ? "contained" :"outlined" }
                                        disableElevation
                                        onClick={() => handlelessonsSortClick(ls) }
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
                        {/* proxyLessons.map(l=>( */}
                        
                        { Object.keys(lessons).map( l => (
                            <Grid
                                key={l.title}
                                container
                                spacing={3}
                                alignItems="center"
                            >
                                <Grid item xs={10}>
                                    <ListItemButton
                                        disableGutters
                                        onClick={()=>handleOpenDetail(l)}
                                        sx={styles.lessonListItem}
                                    >
                                        <ListItemAvatar>
                                            {
                                                l.fileName
                                                ? <Avatar src={`${process.env.REACT_APP_BUCKET}/${l.fileName}`} />
                                                : <Avatar {...stringAvatar(l.title)} />
                                            }
                                            
                                        </ListItemAvatar>
                                        <ListItemText  primary={l.title} secondary={ 
                                            <Fragment>
                                                {l.tags?.map(t => capitalizeFirstLetter(t) ).join(', ')}
                                                {l.tags && <br />}
                                                {toDate(l.creationDate)}
                                            </Fragment>
                                        }/>
                                    </ListItemButton>

                                </Grid>
                                {
                                    l.user === getUserId() &&
                                        <Grid item xs={2}>
                                            <IconButton
                                                edge="end" 
                                                sx={{ color: 'gray' }}
                                                onClick={() => handleEdit(l)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                edge="end" 
                                                sx={{ color: 'gray' }}
                                                onClick={() => handleDelete(l.uuid)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Grid>
                                }
                            </Grid>
                        ))
                        }
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