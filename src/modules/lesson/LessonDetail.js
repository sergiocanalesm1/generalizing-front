import React, { useCallback, useState } from "react";
import Linkify from "react-linkify";

import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Dialog, Grid, Stack, Toolbar, Typography } from "@mui/material";

import { capitalizeFirstLetter, stringToColor } from "../../utils/strings";
import MyEditor from "../home/components/MyEditor";
import RelationListDialog from "../relation/RelationList";
import { useHookstate } from "@hookstate/core";
import { domainsState, originsState, tagsState, relationsToListState } from "../../globalState/globalState";

const styles = {
    root: {
  
    },
    editor: {
      p:1,
    },
}


function LessonDetailDialog({ lesson, open, onClose }) {
    const [openRelationListDialog, setOpenRelationListDialog] = useState( false );

    const tags = useHookstate(tagsState);
    const domains = useHookstate(domainsState);
    const origins = useHookstate(originsState);
    const relationsToList = useHookstate(relationsToListState);

    const handleOpenExistingRelations = useCallback(() => {
        relationsToList.set(JSON.parse(JSON.stringify(lesson.relations)));
        setOpenRelationListDialog(true)
    },[relationsToList, lesson])
    if( !lesson ){
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    return(
        <div>
            <Dialog
                fullWidth
                open={open}
                scroll="paper"
                onClose={onClose}
            >
                <Card sx={{overflow: 'auto'}}>
                    {lesson.fileName &&
                        <CardMedia
                            component="img"
                            height="50%"
                            image={`${process.env.REACT_APP_BUCKET}/${lesson.fileName}`}
                            alt="lesson_file"
                        />
                    }
                    <CardContent>
                        <Typography variant="h4">{lesson.title}</Typography>
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
                                        <a key={key} target="blank" href={decoratedHref}>
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
                            { lesson.tags && 
                                lesson.tags.map( tagId => {
                                    const {tag} = tags.get()[ tagId ]
                                    return (
                                        <Chip 
                                            key={tag}
                                            label={capitalizeFirstLetter(tag)}
                                            sx={{
                                                bgcolor:stringToColor(tag),
                                                color:"#FFF",
                                                m:1}}
                                        />
                                    )
                                })
                            }
                            </Stack>
                        <Stack 
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Typography variant="small">
                                { domains.get()[ lesson.domain ].domain }, { origins.get()[ lesson.origin ].origin }
                            </Typography>
                        </Stack>
                    </CardContent>
                        { lesson.relations
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
                relations={lesson.relations}
                filterType="Lesson"
                filters={lesson.title}
                onClose={()=>setOpenRelationListDialog(false)}
            />
        </div>
    );
}

export default LessonDetailDialog;
