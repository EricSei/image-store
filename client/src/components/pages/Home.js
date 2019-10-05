import React, { useState, useEffect } from 'react';
import { PromiseProvider } from 'mongoose';

const Home = props => {
  // ------------------------------------------------------------------------
  // States
  // ------------------------------------------------------------------------  
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState(null);

  // ------------------------------------------------------------------------
  // Lifecycles
  // ------------------------------------------------------------------------
  useEffect(() => {
    fetchImages();
  }, []);
  
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/display/fetchall');
      const images   = await response.json();
      
      setImages(images);
    } catch (error) {
      setImages([]);
    }
  }

  const fetchUserId = async token => {
    try {
      const response = await fetch('/api/userid', {
        headers: {
          Authorization: token
        }
      });
  
      const data = await response.json();
  
      setUserId(data.userId);
    } catch (error) {
      setUserId(null);
    }

  }

  fetchUserId(props.token);

  //-------------------------------------------------------------------------
  // Delete image
  // ------------------------------------------------------------------------

  const deleteHandler = async (e, filename) => {
    const response = await fetch(`/api/delete/${filename}?_method=DELETE`, {method: 'POST'});
    const delImg = await response.json();
    setImages( images.filter( image => delImg.image.filename != image.filename ) );
  }

  // ------------------------------------------------------------------------
  // Conditional Renders
  // ------------------------------------------------------------------------
  const renderImages = () => {
    if (!images.length) {
      return <div>...</div>;
    } else {
      return (
        <div className="container-fluid">
          <div className="row justify-content-center align-items-left">
          {
            images.map(image => {
              return (
                <div className="thumbnail col-md-3 p-2 my-0 mx-0 border border-dark">
                  <img 
                    key={image.filename} 
                    src={`/api/display/filestream/${image.filename}`}
                  />
                  <div className="overflow-auto">
                    <h4 className="font-weight-bold d-inline-block">
                      Creator: { image.creator? image.creator : 'null' }
                    </h4>  
                    {renderDeleteButton(image.creator, image.filename)}
                  </div>
                                

                </div>
              )
            })
          }
          </div>
        </div>
      );
    }
  }

  const renderDeleteButton = (creatorId, filename) => {
    return userId && userId === creatorId? 
      <button onClick = { e => deleteHandler(e, filename) }>Delete</button> 
      : null;
  }

  // ------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------  
  return (
    <div>
      <h1 className="font-weight-bold display-3">Home</h1>
      {renderImages()}
    </div>
  );
};

export default Home;
