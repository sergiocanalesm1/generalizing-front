import { Add, ArrowBack, Send } from "@mui/icons-material";
import { Avatar, Box, Button, Dialog, Grid, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllLessons } from "../../services/lessons_services";
import { createOrUpdateRelation } from "../../services/relations_services";
import { methods } from "../../services/urls";
import { homePath } from "../../utils/paths";
import { stringAvatar } from "../../utils/strings";
import { getUserId, getUserUuid } from "../../utils/user";
import FeedbackDialog from "../components/FeedbackDialog";
import LessonDetailCard from "../lesson/LessonDetail";
import LessonListDialog from "../lesson/LessonList";


const  styles = {
  relationPaper: {
    m: 2,
    p: 2,
    paddingLeft: 8,
    paddingRight: 8
  },
  relationBox:{
    maxWidth: '100%',
    '& button': { m: 1 }
  },
  relationAvatar:{
    width: 100,
    height: 100
  },
  relationDefaultAvatar:{
    width: 100,
    height: 100,
    bgcolor: "#808080"
  },
}

function Relation() {

  const navigate = useNavigate();
  const { state } = useLocation();

  //TODO fix force update
  const [,updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [lessons, setLessons] = useState([]);
  const [openLessonList, setOpenLessonList] = useState(false);

  const [chosenLessons, setChosenLessons] = useState([]);
  const [lessonToChoose, setLessonToChoose] = useState();
  const [chosenIndex, setChosenIndex] = useState(-1);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedLessonDetail, setSelectedLessonDetail] = useState();

  const [openFeedbackDialog,setOpenFeedbackDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  const [files, setFiles] = useState([]);

  const [relation, setRelation] = useState({
    name : "",
    user : "",
    lessons : "",
    explanation : "",
  });

  const handleChange = useCallback((e)=>{
    setRelation({
      ...relation,
      [e.target.name] : e.target.value
    })
  }, [relation] );

  const detailOrListLesson = useCallback(async(index)=>{
    const fetchedLessons = await getAllLessons();
    setLessons(fetchedLessons);

    if( !chosenLessons[index] ){
      //choose lesson, show list
      setChosenIndex(index);
      setOpenLessonList(true);
    }
    else{
      //show detail
      setSelectedLessonDetail(chosenLessons[index]);
      setOpenDetail(true);
    }
  },[chosenLessons]);

  const create = useCallback(async()=>{
    relation.user = getUserId();
    relation.lessons = chosenLessons.map((l)=>l.id);
    if( state?.challengeId ){
      relation.challenge = state.challengeId;
    }
    let method = methods.CREATE;
    if( state?.relation ){
      method = methods.UPDATE;
    }
    await createOrUpdateRelation( relation, files, method,
      ()=>{
        setSuccess(true);
        setOpenFeedbackDialog(true);
      },
      ()=>{
        setSuccess(false);
        setOpenFeedbackDialog(true);
      }
    )
  },[chosenLessons, files, relation, state]);

  useEffect(()=>{
    if( lessonToChoose ){
      //TODO check if same lesson
      const newChosen = chosenLessons;
      newChosen[ chosenIndex ] = lessonToChoose;
      setChosenLessons( newChosen );
      forceUpdate();
      setLessonToChoose();
    }
    if( state ){
      if( state.challengeLessons ){
        setChosenLessons( state.challengeLessons );
      }
      if( state.relation ){
        setChosenLessons( state.relation.lessons );
        setRelation( state.relation );
      }
    }
  },[ lessonToChoose, chosenIndex, chosenLessons, forceUpdate, state ])

  useEffect(()=>{
    if( !Boolean(getUserUuid()) ) {
      navigate( homePath );
    }
  },[navigate])

  return (
    <div>
      <Toolbar />
      <Paper 
        elevation={5}
        sx={styles.relationPaper}
      >
        <Box
          component="form"
          autoComplete="off"
          sx={styles.relationBox}
        >

          <Stack justifyContent="center" direction="row">
            <Typography variant="h2">
              {
                state
                ? <>Relating Challenge {state.challengeId}</>
                : <>Create a Relation</>
              }
            </Typography>
          </Stack>

          <Toolbar />
          <Stack justifyContent="center" direction="row">
            <Typography variant="body">
              Lessons to Relate
            </Typography>
          </Stack>
          <Stack
            justifyContent="space-evenly"
            alignContent="center"
            direction="row"
          >
            <Button 
              onClick={() => detailOrListLesson(0)}
            >
                { chosenLessons[0]
                  ?                                         
                    chosenLessons[0].files?.length > 0
                    ? <Avatar src={chosenLessons[0].files[0].file.split("?")[0]} sx={styles.relationAvatar}/>
                    : <Avatar {...stringAvatar(chosenLessons[0].name, styles.relationAvatar)} />
                  : <Avatar sx={styles.relationAvatar}>
                      <Add fontSize="large"/>
                    </Avatar>
                }
            </Button>
            <Button onClick={() => detailOrListLesson(1)}>
                { chosenLessons[1]
                  ?                                         
                    chosenLessons[1].files?.length > 0
                    ? <Avatar src={chosenLessons[1].files[0].file.split("?")[0]} sx={styles.relationAvatar}/>
                    : <Avatar {...stringAvatar(chosenLessons[0].name, styles.relationAvatar)} />
                  : <Avatar sx={styles.relationAvatar}>
                      <Add fontSize="large"/>
                    </Avatar>
                }
            </Button>
          </Stack>

          <Toolbar />
            
          <Stack justifyContent="center" direction="row">
            <Typography variant="body">
              <strong>Explain</strong> how you relate these concepts
            </Typography>
          </Stack>
          <TextField
            value={relation.explanation}
            fullWidth
            name="explanation"
            multiline
            onChange={handleChange}
            required
            minRows={3}
            disabled={chosenLessons.length < 2}
          />

          <Toolbar />
          <Stack justifyContent="center" direction="row">
            <Typography variant="body">
              Give it a <strong>name</strong>
            </Typography>
          </Stack>
          <TextField
            value={relation.name}
            fullWidth
            name="name"
            onChange={handleChange}
            required
            disabled={chosenLessons.length < 2}
          />

          <Toolbar />
          <Stack justifyContent="center" direction="row">
            <Typography variant="body">
              Provide an optional file showing your product
            </Typography>
          </Stack>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Button
                variant="contained"
                component="label"
                disabled={chosenLessons.length < 2}
              >
                Upload
                <input
                  type="file"
                  hidden
                  onChange={(e) => setFiles(e.target.files[0])}
                />
              </Button>
            </Grid>
            <Grid item>
            <Typography variant="small">
              {files.name}
            </Typography>
            </Grid>
          </Grid>

          <Toolbar />
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Button 
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(homePath)}
            >
              Go Back
            </Button>
            <Button 
              variant="contained"
              endIcon={<Send color="secondary" />}
              onClick={create}
              disabled={!relation.name}
            >
              Relate!
            </Button>
          </Stack>
        </Box>
      </Paper>
      <LessonListDialog
        open={openLessonList}
        setOpen={setOpenLessonList}
        onClose={()=>{
          setOpenLessonList(false);
        }}
        lessons={lessons}
        canChoose
        setChosenLesson={setLessonToChoose}
      />
      <Dialog
        open={openDetail}
        onClose={()=>setOpenDetail(false)}
        fullWidth
      > 
        <LessonDetailCard
            lesson={selectedLessonDetail}
            onClose={()=>setOpenDetail(false)}
        />
      </Dialog>
      <FeedbackDialog
        success={success}
        open={openFeedbackDialog}
        onClose={()=>{
            setOpenFeedbackDialog(false);
            if( success ){
              navigate(homePath);
            }
        }}
      />      
    </div>
  );
}



export default Relation;