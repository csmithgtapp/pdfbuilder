import React from 'react';
import { fabric } from 'fabric';

class TextElement {
  static create(properties = {}) {
    const {
      text = 'Enter text here',
      fontSize = 16,
      fontFamily = 'Arial',
      textAlign = 'left',
      fontWeight = 'normal',
      color = '#000000',
      x = 100,
      y = 100,
      width = 200
    } = properties;
    
    const textbox = new fabric.Textbox(text, {
      left: x,
      top: y,
      width,
      fontSize,
      fontFamily,
      textAlign,
      fontWeight,
      fill: color,
    });
    
    return textbox;
  }
  
  static getDefaultProperties() {
    return {
      text: 'Enter text here',
      fontSize: 16,
      fontFamily: 'Arial',
      textAlign: 'left',
      color: '#000000',
      fontWeight: 'normal',
    };
  }
}

export default TextElement;