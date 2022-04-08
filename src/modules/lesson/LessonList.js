import { Edit } from "@mui/icons-material";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { Fragment, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toDate } from "../../utils/dates";
import { lessonPath } from "../../utils/paths";
import { capitalizeFirstLetter, stringAvatar } from "../../utils/strings";
import { getUserId } from "../../utils/user";
import LessonDetailCard from "./LessonDetail";

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


function LessonListDialog({open, setOpen, onClose, lessons, canChoose, setChosenLesson}) {

    const navigate = useNavigate();

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState();

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

    return(
        <div>
            <Dialog
                scroll="paper"
                open={open}
                onClose={onClose}
                fullWidth
            >
                <DialogTitle>
                    <div>
                        <Typography variant="h3">
                            View Lessons
                        </Typography>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <List sx={styles.lessonList}>
                        { lessons.map((l)=>(
                            <Stack direction="row" justifyContent="flex-start" key={l.id}>
                                <ListItemButton
                                    disableGutters
                                    onClick={()=>handleOpenDetail(l)}
                                    sx={styles.lessonListItem}
                                >
                                    <ListItemAvatar>
                                        {
                                            l.files.length > 0
                                            ? <Avatar src={l.files[0].file.split("?")[0]} />
                                            : <Avatar {...stringAvatar(l.name)} />
                                        }
                                        
                                    </ListItemAvatar>
                                    <ListItemText  primary={l.name} secondary={ 
                                        <Fragment>
                                            {l.tags.map(t => capitalizeFirstLetter(t) ).join(', ')}
                                            {l.tags && <br />}
                                            {toDate(l.creation_date)}
                                        </Fragment>
                                    }/>
                                </ListItemButton>
                                {
                                    l.user === getUserId() &&
                                    <IconButton
                                        edge="end" 
                                        sx={{ color: 'gray' }}
                                        onClick={() => handleEdit(l)}
                                    >
                                        <Edit />
                                    </IconButton>
                                }
                            </Stack>
                        ))
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth
                open={openDetail}
                onClose={handleDetailClose}
                scroll="paper"
            >
                <LessonDetailCard
                    lesson={selectedLesson}
                    onClose={handleDetailClose}
                />
            </Dialog>
        </div>
        
    )
}

export default LessonListDialog;