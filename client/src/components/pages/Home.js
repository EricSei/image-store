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
                  <span>Creator: { image.creator? image.creator : 'null' }</span>
                  {renderDeleteButton(image.creator)}
                </div>
              )
            })
          }
        </div>
      );
    }
  }

  const renderDeleteButton = creatorId => {
    return userId && userId === creatorId? <button>Delete</button> : null;
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
