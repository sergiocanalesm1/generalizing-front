import { Button, Card, CardActions, CardContent, CardMedia, Chip, Stack, Toolbar, Typography } from "@mui/material";
import { capitalizeFirstLetter, stringToColor } from "../../utils/strings";


function LessonDetailCard({ lesson, onClose }) {
    //TODO fix file url
    return(
        <Card sx={{overflow: 'auto'}}>
            {lesson.files && lesson.files.length > 0 &&
                <CardMedia
                    component="img"
                    height="50%"
                    image={lesson.files[0].file.split("?")[0]}
                    alt="lesson_file"
                />
            }
            <CardContent>
                <Typography variant="h4">{lesson.name}</Typography>
                <Toolbar  />
                <Typography variant="body">{lesson.description}</Typography>
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
            <Stack direction="row" justifyContent="flex-end">
                <CardActions onClick={onClose}>
                    <Button  color="primary">
                        Close
                    </Button>
                </CardActions>
            </Stack>
        </Card>
    );
}

export default LessonDetailCard;