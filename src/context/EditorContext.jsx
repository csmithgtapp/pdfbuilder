import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Create context
const EditorContext = createContext();

// Custom hook to use the editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

// Provider component
export const EditorProvider = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 595, height: 842 }); // A4 size in px at 72 DPI
  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);
  const [mode, setMode] = useState('select'); // select, pan, text, shape, etc.
  const [editorHistory, setEditorHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Function to init/update canvas reference
  const initCanvas = (canvas) => {
    setFabricCanvas(canvas);
    setIsCanvasInitialized(true);
  };

  // Function to update the selected element
  const updateSelectedElement = (updatedElement) => {
    setSelectedElement(updatedElement);
    
    // Also update the element on the canvas
    if (fabricCanvas && updatedElement) {
      const canvasObject = fabricCanvas.getObjects().find(
        obj => obj.id === updatedElement.id
      );
      
      if (canvasObject) {
        // Update properties based on element type
        if (updatedElement.type === 'text' || updatedElement.type === 'paragraph') {
          canvasObject.set({
            text: updatedElement.properties.text,
            fontSize: updatedElement.properties.fontSize,
            fontFamily: updatedElement.properties.fontFamily,
            textAlign: updatedElement.properties.textAlign,
            fontWeight: updatedElement.properties.fontWeight,
            fill: updatedElement.properties.color,
          });
        } else if (updatedElement.type === 'rectangle' || updatedElement.type === 'circle') {
          canvasObject.set({
            fill: updatedElement.properties.fill,
            stroke: updatedElement.properties.stroke,
            strokeWidth: updatedElement.properties.strokeWidth,
          });
          
          if (updatedElement.type === 'rectangle') {
            canvasObject.set({
              rx: updatedElement.properties.borderRadius,
              ry: updatedElement.properties.borderRadius,
            });
          }
        }
        
        // Update position and size
        canvasObject.set({
          left: updatedElement.position.x,
          top: updatedElement.position.y,
          width: updatedElement.position.width,
          height: updatedElement.position.height,
          angle: updatedElement.position.angle,
        });
        
        if (canvasObject.scaleX) {
          canvasObject.set({
            scaleX: updatedElement.position.width / canvasObject.width,
            scaleY: updatedElement.position.height / canvasObject.height,
          });
        }
        
        // Visual indicator for data mapping
        if (updatedElement.dataMapping) {
          canvasObject.set({
            borderColor: '#4CAF50',
            cornerColor: '#4CAF50',
          });
        } else {
          canvasObject.set({
            borderColor: '#2196F3',
            cornerColor: '#2196F3',
          });
        }
        
        fabricCanvas.renderAll();
      }
    }
  };
  
  // Function to set the canvas size
  const setCanvasDimensions = (width, height) => {
    setCanvasSize({ width, height });
    
    if (fabricCanvas) {
      fabricCanvas.setWidth(width);
      fabricCanvas.setHeight(height);
      fabricCanvas.renderAll();
    }
  };
  
  // Function to delete the selected element
  const deleteSelectedElement = () => {
    if (!selectedElement || !fabricCanvas) return;
    
    const canvasObject = fabricCanvas.getActiveObject();
    if (canvasObject) {
      fabricCanvas.remove(canvasObject);
      fabricCanvas.renderAll();
      setSelectedElement(null);
    }
  };
  
  // Function to duplicate the selected element
  const duplicateSelectedElement = () => {
    if (!selectedElement || !fabricCanvas) return;
    
    const canvasObject = fabricCanvas.getActiveObject();
    if (canvasObject) {
      canvasObject.clone((cloned) => {
        cloned.set({
          left: cloned.left + 20,
          top: cloned.top + 20,
          id: `element-${Date.now()}`, // Generate new ID
        });
        
        fabricCanvas.add(cloned);
        fabricCanvas.setActiveObject(cloned);
        fabricCanvas.renderAll();
      });
    }
  };
  
  // Value provided by the context
  const value = {
    selectedElement,
    setSelectedElement,
    updateSelectedElement,
    fabricCanvas,
    initCanvas,
    canvasSize,
    setCanvasDimensions,
    isCanvasInitialized,
    mode,
    setMode,
    deleteSelectedElement,
    duplicateSelectedElement
  };
  
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};