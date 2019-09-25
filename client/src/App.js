import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import UploadForm from './components/pages/UploadForm';

import './App.css';

const App = () => {
  return (
    <Router>
      <Fragment className='App'>
        <Navbar />
        <div className='container'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/about' component={About} />
            <Route exact path='/signin' component={SignIn} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/upload' component={UploadForm} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  );
};

export default App;
