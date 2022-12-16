import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack, Send } from "@mui/icons-material";
import { Autocomplete, Box, Button, Chip, FormHelperText, Grid, MenuItem, Select, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useHookstate } from "@hookstate/core";

import { homePath } from "../../utils/paths";
import { capitalizeFirstLetter, stringToColor } from "../../utils/strings";
import FeedbackDialog from "../components/FeedbackDialog";
import MyEditor from "../home/components/MyEditor";
import { db, domainsState, originsState, tagsState, updatingObjectState, userState } from "../../globalState/globalState";
import { createLesson, updateLesson } from "../../services/lessons_services";
import { createDBTag } from "../../services/tags_services";


const styles = {
  lessonPaper: {
    '@media only screen and (max-width: 600px)': {
      m:0,
      p:1
    },
    m: 2,
    p: 2,
    paddingLeft: 8,
    paddingRight: 8
  },
  lessonBox:{
    maxWidth: '100%',
    '& button': { m: 1 }
  },
  root: {

  },
  editor: {
    '&:hover': {
      outline:"solid 0.5px"
    },
    '&:focus-within': {
      outline:"#00B7EB solid 1px"
    },
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'text',
    p:1,
  },
}

function Lesson() {
  //quitar files por ahora
  const navigate = useNavigate();

  const user = useHookstate(userState);
  const domains = useHookstate(domainsState);
  const origins = useHookstate(originsState);
  const Alltags = useHookstate(tagsState);
  const fbDB = useHookstate(db);
  const updatingObject = useHookstate(updatingObjectState);

  const [lesson, setLesson] = useState({
    "title" : "",
    "description": "",
    "origin": "Book", //book, fix
    "domain": "Other",//other, fix
    "userUid": "",
    "isDescriptionRaw": true
    //tags y files
  });

  const [rawText, setRawText] = useState();

  //const [files, setFiles] = useState({});

  const [tags, setTags] = useState([]);
  const [currentChip, setCurrentChip] = useState("");
  const [success, setSuccess] = useState(false);
  const [openFeedbackDialog,setOpenFeedbackDialog] = useState( false );

  const [isUpdate,setIsUpdate] = useState(false);

  const [dbTags, setDbTags] = useState([]);

  const [fetching, setFetching] = useState(false);

  const handleChange = useCallback((e)=>{
    setLesson({
      ...lesson,
      [e.target.name] : e.target.value
    })
  }, [lesson] );

  const handleChipDelete = useCallback( tagToDelete => {
    setTags((tags) => tags.filter((t) => t.label !== tagToDelete.label));
  },[])

  const createTag  = useCallback(() => {
    const newTag = {
      label: currentChip,
      color: stringToColor(currentChip),
    }
    setCurrentChip("");
    setTags([ ...tags, newTag ])
  }, [tags,currentChip])

  const createOrUpdate = useCallback( async()=> {
    setFetching(true);


    const lessonToCreateOrUpdate = {};

    //TODO fix this logic, look for a way to get the ids directly from the autocomplete
    let originToId = {}
    Object.keys( origins.get() ).forEach( id => {
      originToId = {
        ...originToId,
        [origins.get()[id].origin] : id 
    }})

    let domainsToId = {}
    Object.keys( domains.get() ).forEach( id => {
      domainsToId = {
        ...domainsToId,
        [domains.get()[id].domain] : id 
    }})

    let tagsToId = {};
    Object.keys( Alltags.get() ).forEach( id => {
      tagsToId = {
        ...tagsToId,
        [capitalizeFirstLetter(Alltags.get()[id].tag)] : id 
    }})

    let tagIds = [];
    let existingTagId, label; 
    for( let i=0; i < tags.length; i++ ){
      label = tags[i].label.toLowerCase();
      existingTagId = tagsToId[ label ];
      if( !existingTagId ){
        existingTagId = await createDBTag(fbDB.get(), { tag: label } )
      }
      tagIds.push(existingTagId);
    }

    lessonToCreateOrUpdate.title = lesson.title;
    lessonToCreateOrUpdate.origin = originToId[ lesson.origin ];
    lessonToCreateOrUpdate.domain = domainsToId[ lesson.domain ];
    lessonToCreateOrUpdate.userUid = user.get().uid;
    lessonToCreateOrUpdate.creationDate = Date.now();
    lessonToCreateOrUpdate.isDescriptionRaw = lesson.isDescriptionRaw ? 1 : 0;

    
    if( lesson.isDescriptionRaw ){
      lessonToCreateOrUpdate.description = JSON.stringify( rawText );
    }

    if( !rawText || !lesson.isDescriptionRaw ){
      lessonToCreateOrUpdate.description = lesson.description;
    }

    updatingObject.set({
      object:{},
      state:false
    })  //if error then what, bug?
    if( isUpdate ){
      await updateLesson( fbDB.get(), lesson.id, lessonToCreateOrUpdate, onSuccess, onError )
    }
    else {
      await createLesson( fbDB.get(), lessonToCreateOrUpdate, onSuccess, onError )
    }
  
    setFetching(false);
  },[ lesson, tags, rawText ])

  const onSuccess = useCallback(()=>{
    setSuccess(true);
    setOpenFeedbackDialog(true);
  },[])

  const onError = useCallback(()=>{
    setSuccess(false);
    setOpenFeedbackDialog(true);
  },[])
  

  useEffect(()=>{
    if( !user.get().uid ) {
      navigate( homePath );
    }
    if( updatingObject.get().state ){
      const lessonToUpdate = { ...updatingObject.get().object };
      
      lessonToUpdate.domain = domains.get()[ lessonToUpdate.domain ].domain;
      lessonToUpdate.origin = origins.get()[ lessonToUpdate.origin ].origin;
      setLesson( lessonToUpdate );
      setIsUpdate(true);
      
      setTags( lessonToUpdate.tags.map( tId => ({
        label: Alltags.get()[tId].tag,
        color:stringToColor(Alltags.get()[tId].tag)
      })) );
    }
    setDbTags( Object.keys(Alltags.get()).map( id => ( capitalizeFirstLetter( Alltags.get()[ id ].tag ) ) ) )
  },[])

  return (
    <div>
      <Toolbar />
      <Box 
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
                  <strong>Title</strong> of the Lesson
                </Typography>

                <TextField
                  value={lesson.title}
                  fullWidth
                  name="title"
                  onChange={handleChange}
                  required
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack justifyContent="center" direction="column">
                <Typography variant="body" align="center">
                  Domain and where you learned it from
                </Typography>
              </Stack>
              <Grid 
                container
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Grid item xs={5}>
                  <Autocomplete
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      clearOnEscape
                      options={ Object.keys( domains.get() ).map( id => domains.get()[ id ].domain ) }
                      name="domain"
                      value={ lesson.domain }
                      onInputChange={(event, newInputValue) => {//fix
                        if( Object.keys( domains.get() ).map( id => domains.get()[ id ].domain ).indexOf(newInputValue) > -1 ){
                          setLesson( prevState => ({
                            ...prevState,
                            domain: newInputValue
                          }))
                        }
                      }}
                      renderInput={(params) => <TextField {...params}/>}
                    />
                  <FormHelperText>Domain</FormHelperText>
                </Grid>
                <Grid item>
                  <Select
                    name="origin"
                    label="Origin"
                    value={lesson.origin}
                    onChange={handleChange}
                    required
                  >
                    { Object.keys(origins.get()).map(oId => (
                      <MenuItem value={origins.get()[oId].origin} key={oId}> { origins.get()[oId].origin } </MenuItem>
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
              <strong>Explanation</strong>. The simpler, the better.
            </Typography>
          </Stack>
          { lesson.isDescriptionRaw
            ? <Box sx={styles.root}>
                <Box sx={styles.editor}>
                    <MyEditor
                      setText={setRawText}
                      rawText={ isUpdate ? lesson.description : undefined}
                    />
                </Box>
              </Box>
            : <TextField
                value={lesson.description}
                fullWidth
                name="description"
                multiline
                onChange={handleChange}
                minRows={3}
                required
                autoComplete={false}
              />
          }

          <Toolbar />
          <Grid container justifyContent="center" alignItems="center">
            {/*
            <Grid item xs={12} md={6}>
              <Stack direction="row" justifyContent="center">
                <Typography variant="body">
                  Provide photos if helpful
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
                  >
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setFiles(e.target.files[0])}
                    />
                  </Button>
                </Grid>
                <Grid item >
                <Typography variant="small">
                  { files.name }
                </Typography>
                </Grid>
              </Grid>
            </Grid>
            */}
            <Grid item xs={12} md={6} sx={{pt:1}}>
              <Stack direction="row" justifyContent="center">
                <Typography variant="body">
                  <strong>Tags</strong> for the lesson
                </Typography>
              </Stack>
              <Grid
                item
                container
                justifyContent="center"
                alignItems="center"
              >
                
                <Grid item xs={12} md={6}>
                  { 
                    <Autocomplete
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={dbTags}
                      value={currentChip}
                      name="chip"
                      onInputChange={(event, newInputValue) => {
                        setCurrentChip(newInputValue)
                      }}
                      renderInput={(params) => <TextField {...params}/>}
                    />
                  }
                </Grid>
                <Grid item xs={4} md={2}>
                  <Button
                    onClick={createTag}
                    variant="contained"
                    fullWidth
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
                  disabled={ (!lesson.title || !(lesson.description || rawText)) || fetching }
                >
                  { isUpdate ? "Update" : "Create!" }
                </Button>
            </Stack>
          
        </Box>
      </Box>
      <FeedbackDialog
        success={success}
        open={openFeedbackDialog}
        onClose={()=>{
            setOpenFeedbackDialog(false)
            if(success){
              navigate( 0 )
            }
        }}
      />
    </div>
    
  );
}



export default Lesson;