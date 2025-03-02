import React from 'react';
import { fabric } from 'fabric';

class ShapeElement {
  static createRectangle(properties = {}) {
    const {
      fill = 'transparent',
      stroke = '#000000',
      strokeWidth = 1,
      borderRadius = 0,
      x = 100,
      y = 100,
      width = 200,
      height = 100
    } = properties;
    
    const rect = new fabric.Rect({
      left: x,
      top: y,
      width: width,
      height: height,
      fill: fill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      rx: borderRadius,
      ry: borderRadius,
    });
    
    return rect;
  }
  
  static createCircle(properties = {}) {
    const {
      fill = 'transparent',
      stroke = '#000000',
      strokeWidth = 1,
      x = 100,
      y = 100,
      radius = 50
    } = properties;
    
    const circle = new fabric.Circle({
      left: x,
      top: y,
      radius: radius,
      fill: fill,
      stroke: stroke,
      strokeWidth: strokeWidth,
    });
    
    return circle;
  }
  
  static getDefaultRectangleProperties() {
    return {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1,
      borderRadius: 0,
    };
  }
  
  static getDefaultCircleProperties() {
    return {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1,
      radius: 50,
    };
  }
}

export default ShapeElement;