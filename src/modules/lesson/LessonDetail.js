import { Card, CardContent, CardMedia, Chip, Stack, Toolbar, Typography } from "@mui/material";
import { stringToColor } from "../../utils/strings";

const styles = {
    lessonDetailCard:{
        maxWidth:"100%"
    }
}

function LessonDetailCard({lesson}) {
    //TODO fix file url
    return(
        <Card sx={styles.lessonDetailCard}>
            {lesson.files && lesson.files.length > 0 && //TODO add default generalizing logo!
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

                <Stack direction="row" justifyContent="space-evenly" sx={{p:1}}>
                { lesson.tags?.map( t =>(
                    <Chip key={t} label={t} sx={{bgcolor:stringToColor(t), color:"#FFF"}}/>
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
        </Card>
    );
}

export default LessonDetailCard;