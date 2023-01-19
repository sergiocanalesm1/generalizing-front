import { useHookstate } from "@hookstate/core";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  domainsState,
  lessonsState,
  originsState,
  updatingOrCreatingObjectState,
  userState,
} from "../../globalState/globalState";
import { relationPath } from "../../utils/paths";
import { stringAvatar } from "../../utils/strings";
import AuthModal from "../components/AuthModal";
import FeedbackDialog from "../components/FeedbackDialog";
import MyEditor from "../components/MyEditor";
import LessonDetailDialog from "../lesson/LessonDetail";

const styles = {
  root: {},
  editor: {
    p: 1,
  },
};

function RelationDetailDialog({ open, relation, setOpen, onClose, id }) {
  const navigate = useNavigate();

  const user = useHookstate(userState);
  const lessons = useHookstate(lessonsState);
  const domains = useHookstate(domainsState);
  const updatingOrCreatingObject = useHookstate(updatingOrCreatingObjectState);
  const origins = useHookstate(originsState);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedLessonDetail, setSelectedLessonDetail] = useState();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [success, setSuccess] = useState(true);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  const showLessonDetail = useCallback(lesson => {
    setSelectedLessonDetail(lesson);
    setOpenDetail(true);
  }, []);

  const newRelation = useCallback(
    relation => {
      if (user.get().uid) {
        updatingOrCreatingObject.set({
          object: {
            ...relation,
          },
          creating: true,
        });
        navigate(relationPath);
      } else {
        setOpenAuthModal(true);
      }
    },
    [navigate, user, updatingOrCreatingObject]
  );

  if (!relation) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  // TODO fix file url
  return (
    <div>
      <Dialog fullWidth scroll="paper" open={open} onClose={onClose}>
        <Card sx={{ overflow: "auto" }}>
          <CardContent>
            <Stack direction="row" justifyContent="center">
              <Typography variant="h4">{relation.title}</Typography>
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
              {relation.lessons.map(lessonId => {
                const lesson = lessons.get()[lessonId];
                return (
                  <Stack
                    key={lessonId}
                    direction="column"
                    alignContent="center"
                  >
                    <Stack direction="row" justifyContent="center">
                      <Typography variant="small">
                        {domains.get()[lesson.domain].domain},{" "}
                        {origins.get()[lesson.origin].origin}
                      </Typography>
                    </Stack>
                    <Button onClick={() => showLessonDetail(lesson)}>
                      {lesson.fileName ? (
                        <Avatar
                          src={`${process.env.REACT_APP_BUCKET}/${lesson.fileName}`}
                        />
                      ) : (
                        <Avatar {...stringAvatar(lesson.title)} />
                      )}
                    </Button>
                  </Stack>
                );
              })}
            </Stack>

            {relation.fileName && (
              <div>
                <br />
                <CardMedia
                  component="img"
                  height="50%"
                  image={`${process.env.REACT_APP_BUCKET}/${relation.fileName}`}
                  alt="relation_file"
                />
              </div>
            )}
            <Toolbar />

            {relation.isExplanationRaw ? (
              <Box sx={styles.root}>
                <Box sx={styles.editor}>
                  <MyEditor readOnly rawText={relation.explanation} />
                </Box>
              </Box>
            ) : (
              <Typography variant="body">{relation.explanation}</Typography>
            )}
            <br />
          </CardContent>
          <Grid container>
            <Grid item xs={12} md={10}>
              <CardActions>
                <Button onClick={() => newRelation(relation)}>
                  Another idea? Relate these lessons!
                </Button>
              </CardActions>
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack direction="row" justifyContent="flex-end">
                <CardActions onClick={onClose}>
                  <Button>Close</Button>
                </CardActions>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Dialog>
      <LessonDetailDialog
        open={openDetail}
        lesson={selectedLessonDetail}
        onClose={() => {
          setOpenDetail(false);
          setOpen(true);
        }}
      />
      <AuthModal
        open={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
        }}
        onSuccess={() => {
          setOpenAuthModal(false);
          setSuccess(true);
          setOpenFeedbackDialog(true);
        }}
        onError={() => {
          setSuccess(false);
          setOpenFeedbackDialog(true);
        }}
      />
      <FeedbackDialog
        success={success}
        open={openFeedbackDialog}
        onClose={() => {
          setOpenFeedbackDialog(false);
          if (success) {
            newRelation();
          }
        }}
      />
    </div>
  );
}

export default RelationDetailDialog;
