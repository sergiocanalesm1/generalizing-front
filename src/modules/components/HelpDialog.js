/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useState } from "react";
import { useHookstate } from "@hookstate/core";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  dbState,
  lessonsState,
  relationsState,
} from "../../globalState/globalState";
import { getExamples } from "../../services/examples_services";
import LessonDetailDialog from "../lesson/LessonDetail";
import LessonListDialog from "../lesson/LessonList";
import RelationDetailDialog from "../relation/RelationDetail";
import RelationListDialog from "../relation/RelationList";

const lessonsToShow = {
  song: "lesson_song",
  tough: "lesson_tough",
  subjective: "lesson_subjective",
};

const fetchResource = () =>
  getExamples(dbState.get()).then(fetchedExamples => fetchedExamples);

function HelpDialog({ open, onClose }) {
  const [openLessonDetailDialog, setOpenLessonDetailDialog] = useState(false);
  const [openRelationDetailDialog, setOpenRelationDetailDialog] =
    useState(false);
  const [openLessonList, setOpenLessonList] = useState(false);
  const [openRelationList, setOpenRelationList] = useState(false);
  const [lesson, setLesson] = useState();
  const [relation, setRelation] = useState();

  const lessons = useHookstate(lessonsState);
  const relations = useHookstate(relationsState);
  const examples = useHookstate(fetchResource);

  const showLesson = useCallback(
    type => {
      const { id } = examples.get()[type];
      setLesson(lessons.get()[id]);
      setOpenLessonDetailDialog(true);
    },
    [examples, lessons]
  );

  const showRelation = useCallback(() => {
    const { id } = examples.get().relation_1;
    setRelation(relations.get()[id]);
    setOpenRelationDetailDialog(true);
  }, [examples, relations]);

  return (
    <>
      <Dialog
        fullWidth
        scroll="paper"
        open={open}
        maxWidth="md"
        onClose={onClose}
      >
        <Card
          sx={{
            overflow: "auto",
            "a:hover": {
              cursor: "pointer",
            },
          }}
        >
          <CardMedia
            component="img"
            height="50%"
            image={`${process.env.REACT_APP_BUCKET}/Logo-white.png`}
            alt="generalizing-logo"
            sx={{ p: 2 }}
          />
          <CardContent
            sx={{
              "@media only screen and (max-width: 600px)": {
                p: 2,
              },
              p: 5,
            }}
          >
            <Typography variant="h4">The Driving Force</Typography>
            <br />
            <Typography variant="body">
              This is for the ones who dare to take a step into the unknown. For
              those who permit themselves to err, to think outside the
              constraints of the small world of what is already known. You’ll
              get thrown into a place that will force you to shift your
              perspective, to question your method, and to drop your tools. In
              this attempt, if you choose to face the challenge, you’ll have the
              chance to create something new, something unique.
              <br />
              <br />
              If you think everything is already invented, this is not the place
              for you.
              <br />
              <br />
              Knowledge has been divided into distinct domains, but when
              combined, there's still so much left to discover. We need thinkers
              who dare to step into the unknown and bring with themselves new
              knowledge, who dare to create connections across multiple domains.
              Remember, knowledge doesn't just come from academic lectures, it
              can also be found in our leisure activities, like reading a book
              or watching a play.
              <br />
              <br />
              Everything is fair game for creating new knowledge.
              <br />
              <br />
              At Generalizing, what you learn in your academic life or outside
              is called a Lesson. A connection between Lessons is called a
              Relation.
            </Typography>

            <Toolbar />

            <Typography variant="h4">What is a Lesson exactly?</Typography>
            <br />
            <Typography variant="body">
              Lessons are ideas. They can be objective or subjective. Objective
              ideas are what you learn directly from a source. Subjective ideas
              are theories, opinions or interpretations: something you think
              about a source.
              <br />
              <br />
              <Link onClick={() => showLesson(lessonsToShow.subjective)}>
                Subjective Lesson example
              </Link>
              <br />
              <Link onClick={() => showLesson(lessonsToShow.tough)}>
                Objective Lesson example
              </Link>
              <br />
              <Link onClick={() => setOpenLessonList(true)}>
                Existing Lessons
              </Link>
            </Typography>

            <Toolbar />

            <Typography variant="h4">What is a Relation exactly?</Typography>
            <br />
            <Typography variant="body">
              Relations are connections that generate new knowledge. Think of
              relations as explorations between two or more Lessons. Try
              thinking of something new, even if it is not correct.
              <br />
              <br />
              <Link onClick={showRelation}>Relation example</Link>
              <br />
              <Link onClick={() => setOpenRelationList(true)}>
                Existing Relations
              </Link>
            </Typography>
          </CardContent>
          <Stack direction="row" justifyContent="flex-end">
            <CardActions>
              <Button color="primary" onClick={onClose}>
                Much More Clear! thanks
              </Button>
            </CardActions>
          </Stack>
        </Card>
      </Dialog>
      {lesson && (
        <LessonDetailDialog
          open={openLessonDetailDialog}
          lesson={lesson}
          onClose={() => setOpenLessonDetailDialog(false)}
        />
      )}
      {relation && (
        <RelationDetailDialog
          open={openRelationDetailDialog}
          relation={relation}
          onClose={() => setOpenRelationDetailDialog(false)}
        />
      )}
      {lessons && (
        <LessonListDialog
          open={openLessonList}
          setOpen={setOpenLessonList}
          lessons={lessons}
          onClose={() => setOpenLessonList(false)}
        />
      )}
      {relations && (
        <RelationListDialog
          open={openRelationList}
          setOpen={setOpenRelationList}
          relations={relations}
          onClose={() => setOpenRelationList(false)}
        />
      )}
    </>
  );
}

export default HelpDialog;
