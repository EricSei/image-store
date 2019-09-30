import React, { useState } from 'react';

import history from '../../history';

const SignIn = props => {
  // ------------------------------------------------------------------------
  // States
  // ------------------------------------------------------------------------  
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const { email, password } = user;
  const [error, setError] = useState(null);

  // ------------------------------------------------------------------------
  // Form Handlers
  // ------------------------------------------------------------------------  
  const onChange = event => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
  
      const data = await response.json();
  
      if (data.token) {
        setError('');
        props.setToken(data.token);
        localStorage.setItem('token', data.token);
      }
      
      history.push('/upload');
    } catch (error) {
      setError('Invalid Credentials');
    }
  };

  // ------------------------------------------------------------------------
  // Conditional Renders
  // ------------------------------------------------------------------------   
  const renderError = () => {
    return error? <div>{error}</div> : null;
  }

  // ------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------ 
  return (
    <div className='form-container'>
      <h1>Account Sign In </h1>
      {renderError()}
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Email</label>
          <input
            type='email'
            name='email'
            required
            onChange={onChange}
          ></input>
        </div>
        <div className='form-group'>
          <label htmlFor='name'>Password</label>
          <input
            type='password'
            name='password'
            onChange={onChange}
            required
          ></input>
        </div>
        <input
          type='submit'
          value='Sign In'
          className='btn btn-success btn-block'
        ></input>
      </form>
    </div>
  );
};

export default SignIn;
