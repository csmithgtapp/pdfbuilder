import React from 'react';
import { fabric } from 'fabric';

class TableElement {
  static create(properties = {}) {
    const {
      columns = 3,
      rows = 3,
      headerRow = true,
      bordered = true,
      cellPadding = 5,
      x = 100,
      y = 100,
      width = 300,
      height = 150
    } = properties;
    
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    
    let tableObjects = [];
    
    // Create horizontal lines
    for (let i = 0; i <= rows; i++) {
      tableObjects.push(new fabric.Line([
        0, i * cellHeight, width, i * cellHeight
      ], {
        stroke: '#000000',
        selectable: false,
      }));
    }
    
    // Create vertical lines
    for (let i = 0; i <= columns; i++) {
      tableObjects.push(new fabric.Line([
        i * cellWidth, 0, i * cellWidth, height
      ], {
        stroke: '#000000',
        selectable: false,
      }));
    }
    
    // Create the table group
    const tableGroup = new fabric.Group(tableObjects, {
      left: x,
      top: y,
      width: width,
      height: height,
    });
    
    return tableGroup;
  }
  
  static getDefaultProperties() {
    return {
      columns: 3,
      rows: 3,
      headerRow: true,
      bordered: true,
      cellPadding: 5,
    };
  }
}

export default TableElement;