import React, { useState, useContext, useEffect } from 'react';

const SignUp = props => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
      alert('Please enter all field', 'danger');
    } else if (password !== password2) {
      alert('Passwords do not match', 'danger');
    } else {
      // Sign Up API
      alert('Sign Up !!');
    }
  };

  return (
    <div className='form-container'>
      <h1>
        <span className='text-success'> Account Sing Up </span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'> Name </label>
          <input
            type='text'
            name='name'
            value={name}
            onChange={onChange}
            required
          ></input>
        </div>
        <div className='form-group'>
          <label htmlFor='name'> Email Address </label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          ></input>
        </div>

        <div className='form-group'>
          <label htmlFor='name'> Password </label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
            minLength='6'
          ></input>
        </div>

        <div className='form-group'>
          <label htmlFor='password2'> Confirmed Password </label>
          <input
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
            required
            minLength='6'
          ></input>
        </div>
        <input
          type='submit'
          value='Register'
          className='btn btn-success btn-block'
          minLength='6'
        ></input>
      </form>
    </div>
  );
};

export default SignUp;
