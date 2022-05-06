import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Dialog, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { relationPath } from "../../utils/paths";
import { stringAvatar } from "../../utils/strings";
import { getUserId } from "../../utils/user";
import AuthModal from "../components/AuthModal";
import FeedbackDialog from "../components/FeedbackDialog";
import LessonDetailCard from "../lesson/LessonDetail";


function RelationDetailCard({relation, setOpen, onClose}) {

    const navigate = useNavigate();

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLessonDetail, setSelectedLessonDetail] = useState();
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [success, setSuccess] = useState(true);
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

    const showLessonDetail = useCallback((lesson) => {
        setSelectedLessonDetail(lesson);
        setOpenDetail(true);
    },[])

    const newRelation = useCallback(()=>{
        if(Boolean(getUserId())){
            navigate( relationPath, {
                state:{
                    newRelation: {
                        lessons: relation.lessons
                    }
                }
            })
        }
        else{
            setOpenAuthModal(true);
        }
    },[navigate, relation.lessons])

    //TODO fix file url
    return(
        <div>
            <Card sx={{overflow: 'auto'}}>
                <CardContent>
                    <Stack direction="row" justifyContent="center">
                        <Typography variant="h4">{relation.name}</Typography>
                    </Stack>
                    
                    <br />
                    <Stack direction="row" justifyContent="center">
                        <Typography variant="h6">Lessons:</Typography>
                    </Stack>
                    <Stack
                        justifyContent="space-evenly"
                        alignContent="center"
                        direction="row"
                    >
                        {
                            relation.lessons.map( (l) =>(
                                <Stack direction="column" alignContent="center" key={l.id}>
                                    <Stack direction="row" justifyContent="center">
                                        <Typography variant="small">{l.domain}</Typography>
                                    </Stack>
                                    <Button onClick={()=>showLessonDetail(l)}>
                                        {   
                                            l.files.length > 0
                                            ? <Avatar src={l.files[0].file.split("?")[0]} />
                                            : <Avatar {...stringAvatar(l.name)} />
                                        }
                                    </Button>
                                </Stack>
                            ))
                        }
                    </Stack>
                    
                    {relation.files && relation.files.length > 0 &&
                        <div>
                            <br />
                            <CardMedia
                                component="img"
                                height="50%"
                                image={relation.files[0].file.split("?")[0]}
                                alt="relation_file"
                            />
                        </div>
                    }
                    <Toolbar  />
                    <Typography variant="body">{relation.explanation}</Typography>
                    <br />
                </CardContent>
                <Grid container>
                    <Grid item xs={12} md={10}>
                        <CardActions>
                            <Button onClick={newRelation}>
                                Another idea? Relate these lessons!
                            </Button>
                        </CardActions>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Stack direction="row" justifyContent="flex-end">
                            <CardActions onClick={onClose}>
                                <Button>
                                    Close
                                </Button>
                            </CardActions>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
            <Dialog
                scroll="paper"
                open={openDetail}
                fullWidth
                onClose={() => {
                    setOpenDetail(false);
                    setOpen(true)
                }}
            >
                <LessonDetailCard
                    lesson={selectedLessonDetail}
                    onClose={()=>{
                        setOpenDetail(false);
                        setOpen(true)
                    }}
                />
            </Dialog>
            <AuthModal
                open={openAuthModal}
                onClose={()=>{
                    setOpenAuthModal(false)
                }}
                onSuccess={()=>{
                    setOpenAuthModal(false)
                    setSuccess(true);
                    setOpenFeedbackDialog(true);
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
                    if(success){
                        newRelation();
                    }
                }}
            />
        </div>
    );
}

export default RelationDetailCard;