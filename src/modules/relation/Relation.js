import { useHookstate } from "@hookstate/core";
import { Add, ArrowBack, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  dbState,
  lessonsState,
  updatingOrCreatingObjectState,
  userState,
} from "../../globalState/globalState";
import {
  createRelation,
  updateRelation,
} from "../../services/relations_services";
import { homePath } from "../../utils/paths";
import { stringAvatar } from "../../utils/strings";
import FeedbackDialog from "../components/FeedbackDialog";
import MyEditor from "../components/MyEditor";
import LessonDetailDialog from "../lesson/LessonDetail";
import LessonListDialog from "../lesson/LessonList";

const styles = {
  relationPaper: {
    "@media only screen and (max-width: 600px)": {
      m: 0,
      p: 1,
    },
    m: 2,
    p: 2,
    paddingLeft: 8,
    paddingRight: 8,
  },
  relationBox: {
    maxWidth: "100%",
    "& button": { m: 1 },
  },
  relationAvatar: {
    width: 100,
    height: 100,
  },
  relationDefaultAvatar: {
    width: 100,
    height: 100,
    bgcolor: "#808080",
  },
  root: {},
  editor: {
    "&:hover": {
      outline: "solid 0.5px",
    },
    "&:focus-within": {
      outline: "#00B7EB solid 1px",
    },
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "text",
    p: 1,
  },
};

function Relation() {
  const navigate = useNavigate();

  const user = useHookstate(userState);
  const lessons = useHookstate(lessonsState);
  const fbDB = useHookstate(dbState);
  const updatingOrCreatingObject = useHookstate(updatingOrCreatingObjectState);

  // TODO fix force update
  // eslint-disable-next-line react/hook-use-state
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [openLessonList, setOpenLessonList] = useState(false);

  const [chosenLessons, setChosenLessons] = useState([0, 0]);
  const [lessonToChoose, setLessonToChoose] = useState();
  const [chosenIndex, setChosenIndex] = useState(-1);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedLessonDetail, setSelectedLessonDetail] = useState();

  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  // Const [files, setFiles] = useState([]);

  const [isUpdate, setIsUpdate] = useState(false);

  const [rawText, setRawText] = useState();

  const [relation, setRelation] = useState({
    title: "",
    user: "",
    lessons: "",
    explanation: "",
    isExplanationRaw: true,
  });

  const [fetching, setFetching] = useState(false);

  const handleChange = useCallback(
    e => {
      setRelation({
        ...relation,
        [e.target.name]: e.target.value,
      });
    },
    [relation]
  );

  const onSuccess = useCallback(() => {
    setSuccess(true);
    setOpenFeedbackDialog(true);
  }, []);

  const onError = useCallback(() => {
    setSuccess(false);
    setOpenFeedbackDialog(true);
  }, []);

  const detailOrListLesson = useCallback(
    index => {
      if (chosenLessons[index] === 0) {
        // Choose lesson, show list
        setChosenIndex(index);
        setOpenLessonList(true);
      } else {
        // Show detail
        setSelectedLessonDetail(chosenLessons[index]);
        setOpenDetail(true);
      }
    },
    [chosenLessons]
  );

  const createOrUpdate = useCallback(async () => {
    setFetching(true);

    const relationToCreateOrUpdate = {
      creationDate: isUpdate ? relation.creationDate : Date.now(),
      title: relation.title,
      userUid: user.get().uid,
      lessons: chosenLessons.join(","),
      isExplanationRaw: relation.isExplanationRaw ? 1 : 0,
    };

    if (relation.isExplanationRaw) {
      relationToCreateOrUpdate.explanation = JSON.stringify(rawText);
    }

    if (!rawText || !relation.isExplanationRaw) {
      relationToCreateOrUpdate.explanation = relation.explanation;
    }

    if (isUpdate) {
      const { id } = relation;
      await updateRelation(
        fbDB.get(),
        id,
        relationToCreateOrUpdate,
        onSuccess,
        onError
      );
      navigate(0); // TODO fix update
    } else {
      await createRelation(
        fbDB.get(),
        relationToCreateOrUpdate,
        onSuccess,
        onError
      );
    }

    updatingOrCreatingObject.set({
      object: {},
    }); // If error then what, bug?
    setFetching(false);
  }, [
    chosenLessons,
    relation,
    isUpdate,
    rawText,
    fbDB,
    navigate,
    onError,
    onSuccess,
    updatingOrCreatingObject,
    user,
  ]);

  useEffect(() => {
    if (lessonToChoose) {
      // TODO check if same lesson
      const newChosen = [...chosenLessons];
      newChosen[chosenIndex] = lessonToChoose;
      setChosenLessons(newChosen);
      forceUpdate();
      setLessonToChoose();
    } else if (updatingOrCreatingObject.get().updating) {
      setIsUpdate(true);
      const relation = updatingOrCreatingObject.get().object;
      setChosenLessons(relation.lessons);
      setRelation(relation);
      /*
        If( state.challengeLessons ){
          setChosenLessons( state.challengeLessons );
        }
        */
    } else if (updatingOrCreatingObject.get().creating) {
      const relation = updatingOrCreatingObject.get().object;
      setChosenLessons(relation.lessons);
      setRelation(relation);
    }
  }, [chosenIndex, forceUpdate, lessonToChoose]);

  useEffect(() => {
    if (!user.get().uid) {
      navigate(homePath);
    }
  }, []);

  return (
    <div>
      <Toolbar />
      <Box sx={styles.relationPaper}>
        <Box component="form" autoComplete="off" sx={styles.relationBox}>
          <Stack justifyContent="center" direction="row">
            <Typography variant="h2" align="center">
              Create a Relation
            </Typography>
          </Stack>

          <Toolbar />
          <Stack justifyContent="center" direction="row">
            <Typography variant="body">Lessons to Relate</Typography>
          </Stack>
          <Stack
            justifyContent="space-evenly"
            alignContent="center"
            direction="row"
          >
            {chosenLessons.map((id, i) => {
              const lesson = lessons.get()[id];
              return (
                <Button
                  key={id === 0 ? Math.floor(Math.random() * 30) : id}
                  onClick={() => detailOrListLesson(i)}
                >
                  {lesson ? (
                    lesson.fileName ? (
                      <Avatar
                        src={`${process.env.REACT_APP_BUCKET}/${lesson.fileName}`}
                        sx={styles.relationAvatar}
                      />
                    ) : (
                      <Avatar
                        {...stringAvatar(lesson.title, styles.relationAvatar)}
                      />
                    )
                  ) : (
                    <Avatar sx={styles.relationAvatar}>
                      <Add fontSize="large" />
                    </Avatar>
                  )}
                </Button>
              );
            })}
          </Stack>

          <Toolbar />

          <Grid container direction="row" justifyContent="space-between">
            <Grid item xs={12} md={12}>
              <Stack justifyContent="center" direction="row">
                <Typography variant="body" align="center">
                  <strong>Explain</strong> how you relate these concepts
                </Typography>
              </Stack>

              {relation.isExplanationRaw ? (
                <Box sx={styles.root}>
                  <Box sx={styles.editor}>
                    <MyEditor
                      setText={setRawText}
                      rawText={isUpdate ? relation.explanation : undefined}
                    />
                  </Box>
                </Box>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  required
                  value={relation.explanation}
                  name="explanation"
                  minRows={3}
                  disabled={chosenLessons.length < 2}
                  autcomplete="off"
                  onChange={handleChange}
                />
              )}
            </Grid>

            {/* 
          <Grid item xs={12} md={3}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{
                '@media only screen and (max-width: 600px)': {
                  pt:3
                },
              }}
            >
              <Typography variant="body" align="center">
                Provide an optional file showing your product
              </Typography>
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
              <Typography variant="small">
                {files.name}
              </Typography>
            </Stack>
            </Grid>
            
          */}
          </Grid>

          <Toolbar />
          <Grid container justifyContent="center" alignItems="center">
            <Grid item container justifyContent="center">
              <Typography variant="body">
                Give it a <strong>Title</strong>
              </Typography>
            </Grid>
            <Grid item container justifyContent="center" xs={12} md={7}>
              <TextField
                fullWidth
                required
                value={relation.title}
                name="title"
                disabled={chosenLessons.length < 2}
                onChange={handleChange}
              />
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
              disabled={
                !relation.title ||
                !(relation.explanation || rawText) ||
                fetching
              }
              onClick={createOrUpdate}
            >
              {isUpdate ? "Update" : "Relate!"}
            </Button>
          </Stack>
        </Box>
      </Box>
      <LessonListDialog
        canChoose
        open={openLessonList}
        setOpen={setOpenLessonList}
        lessons={lessons}
        setChosenLesson={setLessonToChoose}
        onClose={() => {
          setOpenLessonList(false);
        }}
      />
      <LessonDetailDialog
        open={openDetail}
        lesson={lessons.get()[selectedLessonDetail]}
        onClose={() => setOpenDetail(false)}
      />
      <FeedbackDialog
        success={success}
        open={openFeedbackDialog}
        onClose={() => {
          setOpenFeedbackDialog(false);
          if (success) {
            navigate(0);
            navigate(homePath);
          }
        }}
      />
    </div>
  );
}

export default Relation;
