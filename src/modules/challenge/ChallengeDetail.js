import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Toolbar, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { stringAvatar } from "../../utils/randoms";
import LessonDetailCard from "../lesson/LessonDetail";

const styles = {
    relationDetailCard:{
        maxWidth:"100%"
    }
}

function ChallengeDetailDialog({open, setOpen, onClose, challenge}) {
    /*
    create circles around challenge
    make relation button passing challenge
    see list of relations of challenge
    */

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLessonDetail, setSelectedLessonDetail] = useState();

    const lessons = useMemo(()=>( [ challenge.lesson_1, challenge.lesson_2 ] ))

    const showLessonDetail = useCallback((lesson) => {
        setSelectedLessonDetail(lesson);
        setOpenDetail(true);
    },[])


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
                            Challenge {challenge.id}
                        </Typography>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack direction="row" justifyContent="center" alignItems="center">
                        <Typography variant="body">
                            All users are given these two lessons. Check out the relations created by many different users!
                        </Typography>
                    </Stack>
                    <br />
                    <Stack
                        justifyContent="space-evenly"
                        alignContent="center"
                        direction="row"
                    >
                        {
                            lessons.map( (l) =>(
                                <Stack direction="column" alignContent="center" key={l.id}>
                                    <Stack direction="row" justifyContent="center">
                                        <Typography variant="small">{l.domain}</Typography>
                                    </Stack>
                                    <Button onClick={()=>showLessonDetail(l)}>
                                        <Avatar {...stringAvatar(l.name, styles.relationAvatar)} />
                                    </Button>
                                </Stack>
                            ))
                        }
                    </Stack>
                    <Toolbar />
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Button 
                            variant="outlined"
                            >
                            Relations Created
                        </Button>
                        <Button 
                            variant="contained"
                        >
                            I want to relate it!
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDetail}
                fullWidth
                onClose={() => {
                    setOpenDetail(false);
                    setOpen(true)
                }}
            >
                <LessonDetailCard
                    lesson={selectedLessonDetail}
                />
            </Dialog>
        </div>
        
    )
}

export default ChallengeDetailDialog;