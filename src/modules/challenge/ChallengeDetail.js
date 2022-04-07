import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from "react";
import LessonDetailCard from "../lesson/LessonDetail";
import { relationPath } from "../../utils/paths";
import { filterByChallenge } from "../../utils/filters";
import { stringAvatar } from "../../utils/strings";


function ChallengeDetailDialog({open, setOpen, onClose, challenge, setOpenList, setRelationsToShow, setFilters, relations }) {

    const navigate = useNavigate()
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLessonDetail, setSelectedLessonDetail] = useState();

    const lessons = useMemo(()=>( [ challenge.lesson_1, challenge.lesson_2 ] ),[challenge])

    const showLessonDetail = useCallback((lesson) => {
        setSelectedLessonDetail(lesson);
        setOpenDetail(true);
    },[])

    const showRelationList = useCallback(()=>{
        setFilters(`Challenge ${challenge.id}`);
        setRelationsToShow( filterByChallenge( relations, challenge.id ) )
        setOpenList(true)
    },[challenge, relations, setFilters, setOpenList, setRelationsToShow])

    const acceptChallenge = useCallback(()=>{
        navigate( relationPath, {
            state:{
                challengeId: challenge.id,
                challengeLessons: lessons
            }
        })
    },[navigate, challenge, lessons])

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
                            All users are given these two lessons. Are you up for the challenge? Try relating these concepts any way you see fit!
                            Also, check out the relations created by many different users
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
                                l &&
                                <Stack direction="column" alignContent="center" key={l.id}>
                                    <Stack direction="row" justifyContent="center">
                                        <Typography variant="small">{l.domain}</Typography>
                                    </Stack>
                                    <Button onClick={()=>showLessonDetail(l)}>
                                        <Avatar {...stringAvatar( l.name )} />
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
                            onClick={showRelationList}
                            >
                            Relations Created
                        </Button>
                        <Button
                            onClick={acceptChallenge}
                            variant="contained"
                        >
                            Accept the challenge!
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