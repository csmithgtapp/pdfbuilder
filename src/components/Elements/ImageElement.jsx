import React from 'react';
import { fabric } from 'fabric';

class ImageElement {
  static create(properties = {}) {
    const {
      src = 'https://via.placeholder.com/200x100',
      alt = 'Image',
      x = 100,
      y = 100,
      width = 200,
      height = 100
    } = properties;
    
    return new Promise((resolve) => {
      fabric.Image.fromURL(src, (img) => {
        img.set({
          left: x,
          top: y,
          scaleX: width / img.width,
          scaleY: height / img.height,
          alt: alt
        });
        
        resolve(img);
      });
    });
  }
  
  static getDefaultProperties() {
    return {
      src: 'https://via.placeholder.com/200x100',
      alt: 'Image',
    };
  }
}

export default ImageElement;