import React, { useState, useEffect } from 'react';
import { PromiseProvider } from 'mongoose';

const Home = () => {
  // ------------------------------------------------------------------------
  // States
  // ------------------------------------------------------------------------  
  const [images, setImages] = useState([]);

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
