import React, { useState } from 'react';
import history from '../../history';

const UploadForm = props => {
  // ------------------------------------------------------------------------
  // States
  // ------------------------------------------------------------------------
  const [files, setFiles] = useState(null);

  // ------------------------------------------------------------------------
  // Event Handlers
  // ------------------------------------------------------------------------
  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();

    for (let file of files) {
      formData.append('file', file);
    }
    
    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: props.token
      }
    });

    history.push('/');
  }

  const selectHandler = () => {
    const fileInput = document.querySelector('#images-input');
    setFiles(fileInput.files);
  }
  
  // ------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------
  return (
    <div>
      <h1>UploadForm</h1>
      <form method='POST' encType='multipart/form-data' onSubmit={handleSubmit}>
        <input id="images-input" type='file' name='file' onChange={selectHandler} multiple />
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
};

export default UploadForm;
