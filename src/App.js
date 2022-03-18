import {
  Routes,
  Route,
} from 'react-router-dom';

import MainLayout from './common/layouts/main/MainLayout';
import Home from './modules/home/Home';
import Lesson from './modules/lesson/Lesson';
import Relation from './modules/relation/Relation'
import { homePath, lessonPath, relationPath } from './utils/paths';


function App() {
  return (
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
  );
}



export default App;
