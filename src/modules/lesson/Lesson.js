import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack, Send } from "@mui/icons-material";
import { Autocomplete, Box, Button, Chip, FormHelperText, Grid, MenuItem, Select, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useHookstate } from "@hookstate/core";

import { homePath } from "../../utils/paths";
import { capitalizeFirstLetter, stringToColor } from "../../utils/strings";
import FeedbackDialog from "../components/FeedbackDialog";
import MyEditor from "../home/components/MyEditor";
import { dbState, domainsState, originsState, tagsState, updatingOrCreatingObjectState, userState } from "../../globalState/globalState";
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
  // Quitar files por ahora
  const navigate = useNavigate();

  const user = useHookstate(userState);
  const domains = useHookstate(domainsState);
  const origins = useHookstate(originsState);
  const Alltags = useHookstate(tagsState);
  const fbDB = useHookstate(dbState);
  const updatingOrCreatingObject = useHookstate(updatingOrCreatingObjectState);

  const [lesson, setLesson] = useState({
    "title" : "",
    "description": "",
    "origin": "Book", // Book, fix
    "domain": "Other",// Other, fix
    "userUid": "",
    "isDescriptionRaw": true
    // Tags y files
  });

  const [rawText, setRawText] = useState();

  // Const [files, setFiles] = useState({});

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
    if( currentChip.trim().length ){
      const newTag = {
        label: currentChip,
        color: stringToColor(currentChip),
      }
      setCurrentChip("");
      setTags([ ...tags, newTag ])
    }
  }, [tags,currentChip])

  const onSuccess = useCallback(()=>{
    setSuccess(true);
    setOpenFeedbackDialog(true);
  },[])

  const onError = useCallback(()=>{
    setSuccess(false);
    setOpenFeedbackDialog(true);
  },[])

  const createOrUpdate = useCallback( async()=> {

    setFetching(true);

    // TODO fix this logic, look for a way to get the ids directly from the autocomplete
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
        [Alltags.get()[id].tag] : id 
    }})

    const tagIds = [];
    let existingTagId; 
    let label; 
    for( let i=0; i < tags.length; i++ ){
      label = tags[i].label.toLowerCase();
      existingTagId = tagsToId[ label ];
      if( !existingTagId ){
        existingTagId = createDBTag(fbDB.get(), { tag: label } )
      }

      tagIds.push(existingTagId);
    }
    
    await Promise.all(tagIds);

    const lessonToCreateOrUpdate = {
      title: lesson.title,
      origin: originToId[ lesson.origin ],
      domain: domainsToId[ lesson.domain ],
      userUid: user.get().uid,
      creationDate: isUpdate ? lesson.creationDate : Date.now(),
      isDescriptionRaw: lesson.isDescriptionRaw ? 1 : 0,
      tags: tagIds
    };

    
    if( lesson.isDescriptionRaw ){
      lessonToCreateOrUpdate.description = JSON.stringify( rawText );
    }

    if( !rawText || !lesson.isDescriptionRaw ){
      lessonToCreateOrUpdate.description = lesson.description;
    }

    updatingOrCreatingObject.set({
      object:{}
    })  // If error then what, bug?
    if( isUpdate ){
      await updateLesson( fbDB.get(), lesson.id, lessonToCreateOrUpdate, onSuccess, onError )
    }
    else {
      await createLesson( fbDB.get(), lessonToCreateOrUpdate, onSuccess, onError )
    }
  
    setFetching(false);
  },[ lesson, tags, rawText, Alltags, domains, fbDB, isUpdate, onError, onSuccess, origins, updatingOrCreatingObject, user ])
  

  useEffect(()=>{
      if( !user.get().uid ) {
        navigate( homePath );
      }

      if( updatingOrCreatingObject.get().updating ){
        const lessonToUpdate = { ...updatingOrCreatingObject.get().object };
        
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
          autComplete="off"
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
                  fullWidth
                  required
                  value={lesson.title}
                  name="title"
                  onChange={handleChange}
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
                  {
                    domains.get() && 
                    <Autocomplete
                        clearOnEscape
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={ Object.keys( domains.get() ).map( id => domains.get()[ id ].domain ) }
                        name="domain"
                        value={ lesson.domain }
                        renderInput={(params) => <TextField {...params}/>}
                        onInputChange={(event, newInputValue) => {// Fix
                          if( Object.keys( domains.get() ).map( id => domains.get()[ id ].domain ).indexOf(newInputValue) > -1 ){
                            setLesson( prevState => ({
                              ...prevState,
                              domain: newInputValue
                            }))
                          }
                        }}
                      />
                    }
                    <FormHelperText>Domain</FormHelperText>
                </Grid>
                <Grid item>
                  { 
                    origins.get() && 
                    <Select
                      required
                      name="origin"
                      label="Origin"
                      value={lesson.origin}
                      onChange={handleChange}
                    >
                      { Object.keys(origins.get()).map(oId => (
                        <MenuItem key={oId} value={origins.get()[oId].origin}> { origins.get()[oId].origin } </MenuItem>
                      ))}
                    </Select>
                  }
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
                fullWidth
                multiline
                required
                value={lesson.description}
                name="description"
                minRows={3}
                autoComplete="off"
                onChange={handleChange}
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
                  { Alltags.get() &&
                    <Autocomplete
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={dbTags}
                      value={currentChip}
                      name="chip"
                      renderInput={(params) => <TextField {...params}/>}
                      onInputChange={(event, newInputValue) => {
                        setCurrentChip(newInputValue)
                      }}
                    />
                  }
                </Grid>
                <Grid item xs={4} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={createTag}
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
                      <Chip key={t.label} label={ capitalizeFirstLetter(t.label) } sx={{bgcolor:t.color, color:"#FFF"}} onDelete={()=>handleChipDelete(t)}/>
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
                  disabled={ (!lesson.title || !(lesson.description || rawText)) || fetching }
                  onClick={createOrUpdate}
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