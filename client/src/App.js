import React, { Fragment, useState } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
import UploadForm from './components/pages/UploadForm';

import './App.css';
import history from './history';

const App = props => {
  const [token, setToken] = useState(null);

  return (
    <Router history={history}>
      <Fragment className='App'>
        <Navbar />
        <div className='container'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/about' component={About} />
            <Route exact path='/signin' component={SignIn} />
            <Route 
              path='/signup' 
              render={() => <SignUp {...props} setToken={setToken} />}
              exact 
            />
            <Route exact path='/upload' component={UploadForm} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  );
};

export default App;
