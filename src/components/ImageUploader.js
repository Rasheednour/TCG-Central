import React, { useState } from 'react';

// this component receives two useState setter functions, shows an upload button to the user to upload an image
// and saves the image as native image file using setImage, and as Base64 using setBase64Image
function ImageUploader({ setImage, setBase64Image }) {

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setBase64Image(reader.result.split(",")[1]);
    };

    if (file && /^image\/(png|jpeg|jpg)$/.test(file.type)) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
    </div>
  );
}

export default ImageUploader;