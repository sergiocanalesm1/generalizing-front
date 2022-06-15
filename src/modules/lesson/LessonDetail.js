import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Dialog, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import Linkify from "react-linkify";
import { capitalizeFirstLetter, stringToColor } from "../../utils/strings";
import MyEditor from "../home/components/MyEditor";
import RelationListDialog from "../relation/RelationList";

const styles = {
    root: {
  
    },
    editor: {
      p:1,
    },
}


function LessonDetailDialog({ lesson, open, onClose }) {
    const [openRelationListDialog, setOpenRelationListDialog] = useState( false );

    const handleOpenExistingRelations = useCallback(() => {
        setOpenRelationListDialog(true)
    },[])
    //TODO fix file url
    if( !lesson ){
        return <></>;
    }

    return(
        <div>
            <Dialog
                fullWidth
                open={open}
                onClose={onClose}
                scroll="paper"
            >
                <Card sx={{overflow: 'auto'}}>
                    {lesson.files && lesson.files.length > 0 &&
                        <CardMedia
                            component="img"
                            height="50%"
                            image={lesson.files[lesson.files.length - 1].file.split("?")[0]}
                            alt="lesson_file"
                        />
                    }
                    <CardContent>
                        <Typography variant="h4">{lesson.name}</Typography>
                        <Toolbar  />

                        { lesson.isDescriptionRaw
                          ? 
                            <Box sx={styles.root}>
                                <Box sx={styles.editor}>
                                    <MyEditor
                                        readOnly
                                        rawText={lesson.description}
                                    />
                                </Box>
                            </Box>
                          : <Typography variant="body">
                                <Linkify
                                    componentDecorator={(decoratedHref, decoratedText, key) => (
                                        <a target="blank" href={decoratedHref} key={key}>
                                            {decoratedText}
                                        </a>
                                    )}
                                >
                                    {lesson.description}
                                </Linkify>
                            </Typography>
                        }
                        <br />
                            <Stack 
                                direction="row" 
                                justifyContent="space-evenly" 
                                sx={{
                                    p:1,
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}>
                            { lesson.tags?.map( t =>(
                                <Chip 
                                    key={t}
                                    label={capitalizeFirstLetter(t)}
                                    sx={{
                                        bgcolor:stringToColor(t),
                                        color:"#FFF",
                                        m:1}}
                                    />
                            ))}
                            </Stack>
                        <Stack 
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Typography variant="small">{lesson.domain}, {lesson.origin}</Typography>
                        </Stack>
                    </CardContent>
                        { lesson.relations && lesson.relations.length > 0 
                            ?
                            <Grid container>
                                <Grid item xs={12} md={10}>
                                    <CardActions>
                                        <Button onClick={handleOpenExistingRelations}>
                                            Check Created relations
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
                            : <Stack direction="row" justifyContent="flex-end">
                                <CardActions onClick={onClose}>
                                    <Button  color="primary">
                                        Close
                                    </Button>
                                </CardActions>
                            </Stack>
                        }
                </Card>
            </Dialog>
            <RelationListDialog
                open={openRelationListDialog}
                setOpen={setOpenRelationListDialog}
                onClose={()=>setOpenRelationListDialog(false)}
                relations={lesson.relations}
                filterType={"Lesson"}
                filters={lesson.name}
            />
        </div>
    );
}

export default LessonDetailDialog;
