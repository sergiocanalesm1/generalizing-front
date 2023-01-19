import { useHookstate } from '@hookstate/core';
import { CircularProgress, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';


import MainLayout from './common/layouts/main/MainLayout';
import { dbState, domainsState, lessonsState, lessonsToListState, originsState, relationsState, relationsToListState, tagsState } from './globalState/globalState';
import { combineLessonsWithRelations } from './helpers/lessons_helper';
import Home from './modules/home/Home';
import Lesson from './modules/lesson/Lesson';
import Relation from './modules/relation/Relation'
import { getAllDomains } from './services/domains_services';
import { getAllLessons } from './services/lessons_services';
import { getAllOrigins } from './services/origins_services';
import { getAllRelations } from './services/relations_services';
import { getAllTags } from './services/tags_services';
import { homePath, lessonPath, relationPath } from './utils/paths';



function App() {

  const lessons = useHookstate(lessonsState);
  const relations = useHookstate(relationsState);
  const domains = useHookstate(domainsState);
  const tags = useHookstate(tagsState);
  const origins = useHookstate(originsState);
  const fbDB = useHookstate(dbState);
  const relationsToList = useHookstate(relationsToListState);
  const lessonsToList = useHookstate(lessonsToListState);
  
  const [fetching, setFetching] = useState(true);

  useEffect(()=>{
    if( fbDB.get() ){
      setFetching(false)
    }
    // check if sometimes db is not defined
  },[fbDB])

  useEffect(()=>{
    let isMounted = true; 

    setFetching(true);
    
    const db = fbDB.get();

    Promise.all([
      getAllRelations(db),
      getAllLessons(db),
      getAllDomains(db),
      getAllTags(db),
      getAllOrigins(db)
    ]).then( values => {

      const fetchedRelations = values[0];
      const fetchedLessons = values[1];
      const fetchedDomains = values[2];
      const fetchedTags = values[3];
      const fetchedOrigins = values[4];
      const combinedLessons = combineLessonsWithRelations(fetchedRelations, fetchedLessons);

      if( isMounted ){
          relations.set(fetchedRelations)
          domains.set(fetchedDomains)
          tags.set(fetchedTags)
          origins.set(fetchedOrigins) 
          lessons.set(combinedLessons)
          relationsToList.set(Object.keys(fetchedRelations));
          lessonsToList.set(Object.keys(fetchedLessons));
          setFetching(false);
      }
  })

    
    return () => { 
        isMounted = false 
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[]);

  return (
    fetching
    ?
      <Stack direction="row" justifyContent="center">  <CircularProgress /> </Stack>
    :
      <MainLayout>
            <Routes>
              <Route 
                path={ homePath }
                element={<Home />}
              />
              <Route path={ lessonPath }
                element={<Lesson />}
              />
              <Route path={ relationPath }
                element={<Relation />}
              />
            </Routes>
      </MainLayout>

  )
}



export default App;
