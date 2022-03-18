import React from 'react';

//import Splash from '../../../modules/splash/Splash';
import Header from '../../../modules/components/Header';


function MainLayout({ children }){

  return (
      <div >
        <Header />
        <div>
          { children }
        </div>
      </div>
    );
}

export default MainLayout;