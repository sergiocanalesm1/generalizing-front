
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

function RelationListDialog({open, setOpen, onClose, relations}) {

    /*
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
    */

    return(
        <div>
            <Dialog
                scroll="paper"
                open={open}
                onClose={onClose}
            >
                <DialogTitle>
                    <div>
                        <Typography variant="h3">
                            View Relations
                        </Typography>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <List sx={styles.relationList}>
                        { relations.map((r)=>(
                            <ListItemButton
                                disableGutters
                                key={r.id}
                                onClick={()=>handleOpenDetail(r)}
                                sx={styles.relationListItem}
                            >
                                <ListItemAvatar>
                                <Avatar {...stringAvatar(r.name)} />
                                </ListItemAvatar>
                                <ListItemText  primary={r.name} secondary={toDate(r.creation_date)}/>
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

export default RelationListDialog;