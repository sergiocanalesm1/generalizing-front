import { useHookstate } from '@hookstate/core';
import { CircularProgress, Stack } from '@mui/material';
import { Fragment } from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';


import MainLayout from './common/layouts/main/MainLayout';
import { dbState } from './globalState/globalState';
import Home from './modules/home/Home';
import Lesson from './modules/lesson/Lesson';
import Relation from './modules/relation/Relation'
import { homePath, lessonPath, relationPath } from './utils/paths';

function App() {

  const db = useHookstate(dbState);
  
  return (
  <Fragment>
    {
      !db.promised //TODO check 
      ? <MainLayout>
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
      :<Stack direction="row" justifyContent="center">  <CircularProgress /> </Stack>
    }
  </Fragment>
  )
}



export default App;
