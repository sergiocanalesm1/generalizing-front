import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHookstate } from "@hookstate/core";
import { Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import {
  dbState,
  filtersState,
  filterTypeState,
  lessonsState,
  lessonsToListState,
  tagsState,
  updatingOrCreatingObjectState,
  userState,
} from "../../globalState/globalState";
import { deleteLesson } from "../../services/lessons_services";
import { toDate } from "../../utils/dates";
import { filterByOwned, shuffle, sortByLatest } from "../../utils/filters";
import { lessonPath } from "../../utils/paths";
import { capitalizeFirstLetter, stringAvatar } from "../../utils/strings";
import ConfirmModal from "../components/ConfirmModal";
import FeedbackDialog from "../components/FeedbackDialog";
import LessonDetailDialog from "./LessonDetail";

const styles = {
  lessonList: {
    width: "100%",
    bgcolor: "background.paper",
    pt: 0,
  },
  lessonListItem: {
    "&:hover": {
      opacity: "0,5",
    },
  },
};

const lessonsSortObj = {
  random: "RANDOM",
  mine: "MINE",
  latest: "LATEST",
};

function LessonListDialog({
  open,
  setOpen,
  onClose,
  canChoose,
  setChosenLesson,
}) {
  const navigate = useNavigate();

  const lessons = useHookstate(lessonsState);
  const user = useHookstate(userState);
  const tags = useHookstate(tagsState);
  const fbDB = useHookstate(dbState);
  const updatingObject = useHookstate(updatingOrCreatingObjectState);
  const lessonsToList = useHookstate(lessonsToListState);
  const filterType = useHookstate(filterTypeState);
  const filters = useHookstate(filtersState);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState();
  const [lessonsFilterCriteria, setLessonsFilterCriteria] = useState(
    lessonsSortObj.random
  );
  const [proxyLessons, setProxyLessons] = useState([]);
  const [latestLessons, setLatestLessons] = useState([]);
  const [ownedLessons, setOwnedLessons] = useState([]);

  const [success, setSuccess] = useState(true);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(() => {});

  const handleOpenDetail = useCallback(
    id => {
      if (canChoose) {
        setChosenLesson(id);
        setOpen(false);
      } else {
        setOpen(false);
        setOpenDetail(true);
        setSelectedLesson(lessons.get()[id]);
      }
    },
    [setOpen, setChosenLesson, canChoose, lessons]
  );

  const handleDetailClose = useCallback(() => {
    setOpenDetail(false);
    setOpen(true);
  }, [setOpen, setOpenDetail]);

  const handleEdit = useCallback(
    (lesson, id) => {
      setOpen(false);
      lesson = {
        ...lesson,
        id,
      };
      updatingObject.set({
        object: lesson,
        updating: true,
      });
      navigate(lessonPath);
    },
    [navigate, setOpen, updatingObject]
  );

  const handleDelete = useCallback(
    async id => {
      setOpenConfirmModal(true);
      setConfirmCallback(() => () => {
        deleteLesson(fbDB.get(), id).then(ok => {
          if (!ok) {
            setSuccess(false);
          }

          setOpenConfirmModal(false);
          setOpenFeedbackDialog(true);
          if (ok) {
            navigate(0);
          }
        });
      });
    },
    [navigate, setOpenConfirmModal, setConfirmCallback, fbDB]
  );

  const handlelessonsSortClick = useCallback(
    criteria => {
      setLessonsFilterCriteria(criteria);
      let sortedLessons = {};

      if (!lessons.get()) {
        return;
      }

      switch (criteria) {
        case lessonsSortObj.random: {
          sortedLessons = {};
          const shuffledIds = [...lessonsToList.get()];
          shuffle(shuffledIds);
          shuffledIds.forEach(id => {
            sortedLessons[id] = lessons.get()[id];
          });
          setProxyLessons(sortedLessons);
          break;
        }

        case lessonsSortObj.mine:
          if (ownedLessons.length === 0) {
            // If lessons havent been cached
            sortedLessons = {};
            sortedLessons = filterByOwned(
              lessonsToList.get(),
              lessons.get(),
              user.get().uid
            );
            setOwnedLessons(sortedLessons);
            setProxyLessons(sortedLessons);
          } else {
            setProxyLessons(ownedLessons);
          }

          break;

        case lessonsSortObj.latest:
          if (latestLessons.length === 0) {
            sortedLessons = {};
            const temp = lessonsToList
              .get()
              .map(id => ({ ...lessons.get()[id], id }));
            temp.sort(sortByLatest);
            temp.forEach(element => {
              sortedLessons[element.id] = element;
            });
            setLatestLessons(sortedLessons);
            setProxyLessons(sortedLessons);
          } else {
            setProxyLessons(latestLessons);
          }

          break;
        default:
          break;
      }
    },
    [lessons, ownedLessons, latestLessons, lessonsToList, user]
  );

  const handleClose = useCallback(() => {
    setLessonsFilterCriteria(lessonsSortObj.random); // Random?
    onClose();
  }, [onClose]);

  useEffect(() => {
    handlelessonsSortClick(lessonsSortObj.random);
  }, [open, handlelessonsSortClick]);

  return (
    <div>
      <Dialog fullWidth scroll="paper" open={open} onClose={handleClose}>
        <DialogTitle>
          <div>
            <Typography variant="h3">View Lessons</Typography>
            {filters.get() && (
              <Typography variant="small">
                Filtering by {filterType.get()}: {filters.get()}
              </Typography>
            )}
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              {lessons.get() &&
                Object.keys(lessonsSortObj).map(ls =>
                  lessonsSortObj[ls] === lessonsSortObj.mine &&
                  !user.get().uid ? (
                    <div key={lessonsSortObj[ls]} />
                  ) : (
                    <Button
                      key={lessonsSortObj[ls]}
                      disableElevation
                      sx={{ borderRadius: 28 }}
                      size="small"
                      color="neutral"
                      variant={
                        lessonsSortObj[ls] === lessonsFilterCriteria
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handlelessonsSortClick(lessonsSortObj[ls])}
                    >
                      {lessonsSortObj[ls]}
                    </Button>
                  )
                )}
            </Stack>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <List sx={styles.lessonList}>
            {/* proxyLessons.map(id=>( */}

            {Object.keys(proxyLessons).map(id => {
              const lesson = proxyLessons[id];
              return (
                <Grid
                  key={`${id},${id}`}
                  container
                  spacing={3}
                  alignItems="center"
                >
                  <Grid item xs={10}>
                    <ListItemButton
                      key={id}
                      disableGutters
                      sx={styles.lessonListItem}
                      onClick={() => handleOpenDetail(id)}
                    >
                      <ListItemAvatar>
                        {lesson.fileName ? (
                          <Avatar
                            src={`${process.env.REACT_APP_BUCKET}/${lesson.fileName}`}
                          />
                        ) : (
                          <Avatar {...stringAvatar(lesson.title)} />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={lesson.title}
                        secondary={
                          <span>
                            {lesson.tags &&
                              lesson.tags
                                .map(tagId =>
                                  capitalizeFirstLetter(tags.get()[tagId].tag)
                                )
                                .join(", ")}
                            {lesson.tags.length && <br />}
                            {toDate(lesson.creationDate)}
                          </span>
                        }
                      />
                    </ListItemButton>
                  </Grid>
                  {lesson.userUid === user.get().uid && (
                    <Grid item xs={2}>
                      <IconButton
                        edge="end"
                        sx={{ color: "gray" }}
                        onClick={() => handleEdit(lesson, id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        edge="end"
                        sx={{ color: "gray" }}
                        onClick={() => handleDelete(id)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <LessonDetailDialog
        open={openDetail}
        lesson={selectedLesson}
        onClose={handleDetailClose}
      />
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        callback={confirmCallback}
      />

      <FeedbackDialog
        success={success}
        open={openFeedbackDialog}
        onClose={() => {
          setOpenFeedbackDialog(false);
          if (success) {
            setOpen(false);
          }
        }}
      />
    </div>
  );
}

export default LessonListDialog;
