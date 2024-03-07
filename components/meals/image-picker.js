"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import classes from "./image-picker.module.css";

const ImagePicker = ({ label, name }) => {
  const [pickedImage, setPickedImage] = useState();
  const inputRef = useRef();

  function handlePickClick() {
    inputRef.current?.click();
  }

  function handleImageChange(e) {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }
    const fileReader = new FileReader();

    fileReader.onload = function () {
      setPickedImage(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image src={pickedImage} alt="Image picked by the user" fill />
          )}
        </div>
        <input
          ref={inputRef}
          className={classes.input}
          type="file"
          name={name}
          id={name}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleImageChange}
          required
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an image
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
