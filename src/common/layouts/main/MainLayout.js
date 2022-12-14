import React, { Fragment } from 'react';

//import Splash from '../../../modules/splash/Splash';
import Header from '../../../modules/components/Header';


function MainLayout({ children }){
  return (
      <Fragment >
        <Header />
        <Fragment>
          { children }
        </Fragment>
      </Fragment>
    );
}

export default MainLayout;