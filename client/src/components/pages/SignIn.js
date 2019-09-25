import React, { useState } from 'react';

const SignIn = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const { email, password } = user;
  const onChange = event => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      alert('Please enter all field', 'danger');
    } else {
      // Sign In API
      alert('Sign In !!');
    }
  };

  return (
    <div className='form-container'>
      <h1>Account Sign In </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Email</label>
          <input
            type='email'
            name='email'
            value={email}
            required
            onChange={onChange}
          ></input>
        </div>
        <div className='form-group'>
          <label htmlFor='name'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
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
