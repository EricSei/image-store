import React from 'react';

const UploadForm = () => {
  return (
    <div>
      <h1>UploadForm</h1>
      <form method='POST' action='/api/upload' enctype='multipart/form-data'>
        <input type='file' name='file' multiple />
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
};

export default UploadForm;
