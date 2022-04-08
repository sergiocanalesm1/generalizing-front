import { Avatar, Button, Card, CardActions, CardContent, Dialog, Stack, Toolbar, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { stringAvatar } from "../../utils/strings";
import LessonDetailCard from "../lesson/LessonDetail";


function RelationDetailCard({relation, setOpen, onClose}) {

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLessonDetail, setSelectedLessonDetail] = useState();

    const showLessonDetail = useCallback((lesson) => {
        setSelectedLessonDetail(lesson);
        setOpenDetail(true);
    },[])

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
                        
                    <Toolbar  />
                    <Typography variant="body">{relation.explanation}</Typography>
                    <br />
                </CardContent>
                <Stack direction="row" justifyContent="flex-end">
                    <CardActions onClick={onClose}>
                        <Button  color="primary">
                            Close
                        </Button>
                    </CardActions>
                </Stack>
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
        </div>
    );
}

export default RelationDetailCard;