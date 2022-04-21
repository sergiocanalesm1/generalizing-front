import { ArrowBack, Send } from "@mui/icons-material";
import { Box, Button, Chip, FormHelperText, Grid, MenuItem, Paper, Select, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrUpdateLesson } from "../../services/lessons_services";
import { methods } from "../../services/urls";
import { domains, origins } from "../../utils/enums";
import { homePath } from "../../utils/paths";
import { capitalizeFirstLetter, stringToColor } from "../../utils/strings";
import { getUserId, getUserUuid } from "../../utils/user";
import FeedbackDialog from "../components/FeedbackDialog";

const styles = {
  lessonPaper: {
    m: 2,
    p: 2,
    paddingLeft: 8,
    paddingRight: 8
  },
  lessonBox:{
    maxWidth: '100%',
    '& button': { m: 1 }
  },
}

function Lesson() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [lesson, setLesson] = useState({
    "name" : "",
    "description": "",
    "origin": origins[ origins.length - 1 ],
    "domain": domains[ domains.length - 1 ],
    "user": ""
  });

  const [files, setFiles] = useState({});

  const [tags, setTags] = useState([]);
  const [currentChip, setCurrentChip] = useState("");
  const [success, setSuccess] = useState(false);
  const [openFeedbackDialog,setOpenFeedbackDialog] = useState( false );

  const [isUpdate,setIsUpdate] = useState(false);

  const handleChange = useCallback((e)=>{
    setLesson({
      ...lesson,
      [e.target.name] : e.target.value
    })
  }, [lesson] );

  const handleChipDelete = useCallback( (tagToDelete) => {
    setTags((tags) => tags.filter((t) => t.label !== tagToDelete.label));
  },[])

  const createTag  = useCallback(() => {
    const newTag = {
      label: currentChip,
      color: stringToColor(currentChip)
    }
    setCurrentChip("");
    setTags([ ...tags, newTag ])
  }, [tags,currentChip])

  const createOrUpdate = useCallback( async()=> {
    lesson.tags = tags.map((t)=>t.label);
    lesson.user = getUserId();

    const method = isUpdate ? methods.UPDATE : methods.CREATE
    await createOrUpdateLesson( lesson, files, method, 
      ()=>{
        setSuccess(true);
        setOpenFeedbackDialog(true);
      },
      ()=>{
        setSuccess(false);
        setOpenFeedbackDialog(true);
      }
    )
  },[ files, lesson, tags, isUpdate ])

  useEffect(()=>{
    if( !Boolean(getUserUuid()) ) {
      navigate( homePath );
    }
    if( state ){
      setIsUpdate(true);
      setLesson( state.lesson );
      setTags( state.lesson.tags.map( t => ({
        label:t,
        color:stringToColor(t)
      })) );
    }
  },[navigate,state])

  

  return (
    <div>
      <Toolbar />
      <Paper 
        elevation={5}
        sx={styles.lessonPaper}
      >
        <Box
          component="form"
          autoComplete="off"
          sx={styles.lessonBox}
        >
          <Stack justifyContent="center" direction="row">
            <Typography variant="h2">
              Create a Lesson
            </Typography>
          </Stack>

          <Toolbar />
          <Grid container>
            <Grid item xs={12} md={7}>
            <Stack justifyContent="center" direction="column">
                <Typography variant="body" align="center">
                  <strong>Name</strong> what you learned
                </Typography>

                <TextField
                  value={lesson.name}
                  fullWidth
                  name="name"
                  onChange={handleChange}
                  required
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack justifyContent="center" direction="column">
                <Typography variant="body" align="center">
                  Select domain and where you learned it from
                </Typography>
              </Stack>
              <Grid 
                container
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Grid item>
                  <Select
                    name="domain"
                    value={lesson.domain}
                    label="Domain"
                    onChange={handleChange}
                    required
                  >
                    {domains.map(d => (
                      <MenuItem value={d} key={d}> {d} </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Domain</FormHelperText>
                </Grid>
                <Grid item>
                  <Select
                    name="origin"
                    value={lesson.origin}
                    label="Origin"
                    onChange={handleChange}
                    required
                  >
                    {origins.map(o => (
                      <MenuItem value={o} key={o}> {o} </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Origin</FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Toolbar />
            
          <Stack justifyContent="center" direction="row">
            <Typography variant="body" align="center">
              <strong>Explain</strong> what you learned the simpler you can. Include links to references if helpful
            </Typography>
          </Stack>
          <TextField
            value={lesson.description}
            fullWidth
            name="description"
            multiline
            onChange={handleChange}
            minRows={3}
            required
          />

          <Toolbar />
          <Grid container justifyContent="space-evenly" alignItems="center">
            <Grid item>
              <Typography variant="body">
                Provide photos if helpful
              </Typography>
              <br />
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
                  { files.name }
                </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="body">
                Create <strong>tags</strong> for your lesson
              </Typography>
              <Grid 
                container
                justifyContent="flex-start"
              >
                <Grid item xs={12} md={8}>
                  <TextField
                    value={currentChip}
                    name="chip"
                    onChange={(e)=>{setCurrentChip(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    onClick={createTag}
                    variant="contained"
                  >
                    Tag it
                  </Button>
                </Grid>
              </Grid>
            </Grid>          
              </Grid>
              
              {tags.length > 0 && <Toolbar /> }
                
              <Stack direction="row" justifyContent="center">
                  <Stack direction="row" spacing={2}>
                    {tags.map( t =>(
                      <Chip key={t.label} label={ capitalizeFirstLetter(t.label) } onDelete={()=>handleChipDelete(t)} sx={{bgcolor:t.color, color:"#FFF"}}/>
                      ))}
                  </Stack>
                </Stack>
              

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
                  onClick={createOrUpdate}
                  disabled={!lesson.name}
                >
                  { isUpdate ? "Update" : "Create!" }
                </Button>
            </Stack>
          
        </Box>
      </Paper>
      <FeedbackDialog
        success={success}
        open={openFeedbackDialog}
        onClose={()=>{
            setOpenFeedbackDialog(false)
            if(success){
              navigate( homePath )
            }
        }}
      />
    </div>
    
  );
}



export default Lesson;