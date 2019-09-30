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
        <div>
          {
            images.map(image => {
              return (
                <div>
                  <img 
                    key={image.filename} 
                    src={`/api/display/filestream/${image.filename}`}
                  />
                  Creator: { image.creator? image.creator : 'null' }
                </div>
              )
            })
          }
        </div>
      );
    }
  }

  // ------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------  
  return (
    <div>
      <h1>Home</h1>
      {renderImages()}
    </div>
  );
};

export default Home;
