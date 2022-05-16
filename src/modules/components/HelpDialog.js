import { Button, Card, CardActions, CardContent, CardMedia, Dialog, Link, Stack, Toolbar, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { getLesson } from "../../services/lessons_services";
import { getRelation } from "../../services/relations_services";
import LessonDetailDialog from "../lesson/LessonDetail";
import LessonListDialog from "../lesson/LessonList";
import RelationDetailDialog from "../relation/RelationDetail";
import RelationListDialog from "../relation/RelationList";

const lessonsToShow = {
    lecture : process.env.REACT_APP_LECTURE_LESSON,
    book : process.env.REACT_APP_BOOK_LESSON,
    personalExperience : process.env.REACT_APP_PERSONAL_EXPERIENCE_LESSON,
    song : process.env.REACT_APP_SONG_LESSON,
    tough : process.env.REACT_APP_TOUGH_LESSON
}

function HelpDialog( {open, lessons, relations, onClose} ){

    const [openLessonDetailDialog, setOpenLessonDetailDialog] = useState( false );
    const [openRelationDetailDialog, setOpenRelationDetailDialog] = useState( false );
    const [openLessonList, setOpenLessonList] = useState( false );
    const [openRelationList, setOpenRelationList] = useState( false );
    const [lesson, setLesson] = useState();
    const [relation, setRelation] = useState();

    const showLesson = useCallback( uuid =>{
        getLesson(uuid).then( fetchedLesson => {
                setLesson(fetchedLesson);
                setOpenLessonDetailDialog(true);
            }
        )
    },[])

    const showRelation = useCallback( () => {
        getRelation(process.env.REACT_APP_EXAMPLE_RELATION).then( fetchedRelation => {
            setRelation(fetchedRelation);
            setOpenRelationDetailDialog(true);
        } )
    },[])


    return(
        <div>
            <Dialog
                scroll="paper"
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
            >
                <Card sx={{overflow: 'auto'}}>
                    <CardMedia
                        component="img"
                        height="50%"
                        image="https://generalizing-test-bucket.s3.us-east-2.amazonaws.com/Logo-white.png"
                        alt="generalizing-logo"
                        sx={{p:2}}
                    />
                    <CardContent sx={{p:5}}>

                        <Typography variant="h4">The Driving Force</Typography>
                        <br />
                        <Typography variant="body">
                            In a world that focuses on learning through <em> specializing</em>, understood as deepening your knowledge in a single domain, this project aims to shift that focus and place it on <em> generalizing</em>: expanding your knowledge across multiple domains.
                            <br />
                            <br />
                            Most worldwide breakthroughs are made by people who dare to take knowledge from one domain and use it to solve problems and create solutions on another one: creativity is born in domain blending.
                            <br />
                            <br />
                            Here you’ll be able to break your routine and add a spark to it. Take a moment to share what you are learning in your everyday life and try to relate it with what is being uploaded on other domains. This way, we are making sure that rather than keeping our associations rigid, we are keeping them playful.
                        </Typography>

                        <Toolbar />

                        <Typography variant="h4">What is a Lesson exactly?</Typography>
                        <br />
                        <Typography variant="body">
                        A lesson is something you find cool from what you have learned. 
                        It can be from a university lecture (<Link onClick={() => showLesson( lessonsToShow.lecture )}>like this one</Link>), 
                        from a book (<Link onClick={() => showLesson( lessonsToShow.book )}>like this one</Link>), 
                        from a personal experience (<Link onClick={() => showLesson( lessonsToShow.personalExperience )}>like this one</Link>), 
                        from a song (<Link onClick={() => showLesson( lessonsToShow.song )}>like this one</Link>) or from other different origins. 
                        A lesson needs to be explained thoroughly, as people who have never heard of what you are learning must understand it. 
                        Even the most difficult concepts have simpler meanings (<Link onClick={() => showLesson( lessonsToShow.tough )}>like this one</Link>). 
                        Don’t worry if something you wish to upload is already on the platform, you must not be discouraged to share it, as the same concept may be interpreted in infinite ways due to our unique subjectivity!
                        <br />
                        <Link onClick={() => setOpenLessonList(true)}>Check lessons already created</Link>
                        

                        </Typography>

                        <Toolbar />

                        <Typography variant="h4">What is a Relation exactly?</Typography>
                        <br />
                        <Typography variant="body">
                            A relation is more than the sum of its lessons. 
                            You must use your subjectivity to create something new from the lessons being related. 
                            Try thinking in products, services, or methodologies that may even lay in other domains (<Link onClick={showRelation}>like this one</Link>). 
                            There is not an incorrect relation, so give yourself the chance to think differently, to shift perspectives and create something nobody has created before.
                            <br />
                            <Link onClick={() => setOpenRelationList(true)}>Check relations already created</Link>

                        </Typography>

                    </CardContent>
                    <Stack direction="row" justifyContent="flex-end">
                        <CardActions>
                            <Button onClick={onClose} color="primary">
                                Much More Clear! thanks
                            </Button>
                        </CardActions>
                    </Stack>
                </Card>
            </Dialog>
            { lesson && 
                <LessonDetailDialog
                    open={openLessonDetailDialog}
                    onClose={() => setOpenLessonDetailDialog(false) }
                    lesson={lesson}
                />
            }
            { relation &&
                <RelationDetailDialog
                    open={openRelationDetailDialog}
                    onClose={() => setOpenRelationDetailDialog(false) }
                    relation={relation}
                />
            }
            { lessons && 
                <LessonListDialog
                    open={openLessonList}
                    setOpen={setOpenLessonList}
                    onClose={()=>setOpenLessonList(false)}
                    lessons={lessons}
                />
            }
            { relations && 
                <RelationListDialog
                    open={openRelationList}
                    setOpen={setOpenRelationList}
                    onClose={()=>setOpenRelationList(false)}
                    relations={relations}
                    />
            }
        </div>
    )
}

export default HelpDialog;