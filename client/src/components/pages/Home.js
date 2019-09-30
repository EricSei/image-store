import React, { useState, useEffect } from 'react';

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
      const response = await fetch('/api/images');
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
                <img 
                  key={image.filename} 
                  src={`/api/image/${image.filename}`}
                />
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
