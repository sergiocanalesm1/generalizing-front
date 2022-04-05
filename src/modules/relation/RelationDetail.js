import { Avatar, Button, Card, CardContent, Dialog, List, Stack, Toolbar, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { stringAvatar } from "../../utils/strings";
import LessonDetailCard from "../lesson/LessonDetail";

const styles = {
    relationDetailCard:{
        maxWidth:"100%"
    }
}

function RelationDetailCard({relation, setOpen}) {

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLessonDetail, setSelectedLessonDetail] = useState();

    const showLessonDetail = useCallback((lesson) => {
        setSelectedLessonDetail(lesson);
        setOpenDetail(true);
    },[])

    //TODO fix file url
    return(
        <div>
            <Card sx={styles.relationDetailCard}>
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
                                        <Avatar {...stringAvatar(l.name, styles.relationAvatar)} />
                                    </Button>
                                </Stack>
                            ))
                        }
                    </Stack>
                        
                    <Toolbar  />
                    <Typography variant="body">{relation.explanation}</Typography>
                    <br />
                    <List component={Stack} direction="row" justifyContent="space-evenly">
                </List>
                </CardContent>
            </Card>
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
    );
}

export default RelationDetailCard;