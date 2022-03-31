import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { toDate } from "../../utils/dates";
import { stringAvatar } from "../../utils/randoms";
import LessonDetailCard from "./LessonDetail";

const styles = {
    lessonList:{ 
        width: '100%',
        maxWidth: 500,
        bgcolor: 'background.paper'
    },
    lessonListItem:{
        '&:hover': {
            opacity:"0,5"
        }
    }
};


function LessonListDialog({open, setOpen, onClose, lessons, canChoose, setChosenLesson}) {

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
                            <ListItemButton
                                disableGutters
                                key={l.id}
                                onClick={()=>handleOpenDetail(l)}
                                sx={styles.lessonListItem}
                            >
                                <ListItemAvatar>
                                <Avatar {...stringAvatar(l.name)} />
                                </ListItemAvatar>
                                <ListItemText  primary={l.name} secondary={toDate(l.creation_date)}/>
                            </ListItemButton>
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
            >
                <LessonDetailCard
                    lesson={selectedLesson}
                />
            </Dialog>
        </div>
        
    )
}

export default LessonListDialog;