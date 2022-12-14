import { useHookstate } from "@hookstate/core";
import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Dialog, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { domainsState, lessonsState, userState } from "../../globalState/globalState";
import { relationPath } from "../../utils/paths";
import { stringAvatar } from "../../utils/strings";
import AuthModal from "../components/AuthModal";
import FeedbackDialog from "../components/FeedbackDialog";
import MyEditor from "../home/components/MyEditor";
import LessonDetailDialog from "../lesson/LessonDetail";

const styles = {
    root: {
  
    },
    editor: {
      p:1,
    },
}

function RelationDetailDialog({open, relation, setOpen, onClose}) {

    const navigate = useNavigate();

    const user = useHookstate(userState);
    const lessons = useHookstate(lessonsState);
    const domains = useHookstate(domainsState);

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
        if( user.get().uid ){
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
    },[navigate, relation, user])

    if( !relation ){
        return<></>;
    }

    //TODO fix file url
    return(
        <div>
            <Dialog
                scroll="paper"
                fullWidth
                onClose={onClose}
                open={open}
            >
                <Card sx={{overflow: 'auto'}}>
                    <CardContent>
                        <Stack direction="row" justifyContent="center">
                            <Typography variant="h4">{relation.title}</Typography>
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
                                relation.lessons.map( lessonId =>{
                                    const lesson = lessons.get()[lessonId];
                                    return(
                                        <Stack direction="column" alignContent="center" key={lesson.title}>
                                            <Stack direction="row" justifyContent="center">
                                                <Typography variant="small">
                                                    { domains.get()[ lesson.domain ].domain }
                                                </Typography>
                                            </Stack>
                                            <Button onClick={()=>showLessonDetail(lesson)}>
                                                {   
                                                    lesson.fileName
                                                    ? <Avatar src={`${process.env.REACT_APP_BUCKET}/${lesson.fileName}`} />
                                                    : <Avatar {...stringAvatar(lesson.title)} />
                                                }
                                            </Button>
                                        </Stack>
                                )})
                            }
                        </Stack>
                        
                        {relation.fileName &&
                            <div>
                                <br />
                                <CardMedia
                                    component="img"
                                    height="50%"
                                    image={`${process.env.REACT_APP_BUCKET}/${relation.fileName}`}
                                    alt="relation_file"
                                />
                            </div>
                        }
                        <Toolbar  />
                        
                        {   relation.isExplanationRaw
                            ?   <Box sx={styles.root}>
                                    <Box sx={styles.editor}>
                                        <MyEditor
                                            readOnly
                                            rawText={relation.explanation}
                                        />
                                    </Box>
                                </Box>
                            :   <Typography variant="body">{relation.explanation}</Typography>
                        }
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
            </Dialog>
            <LessonDetailDialog
                open={openDetail}   
                lesson={selectedLessonDetail}
                onClose={()=>{
                    setOpenDetail(false);
                    setOpen(true)
                }}
            />
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

export default RelationDetailDialog;