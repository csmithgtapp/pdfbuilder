import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useEditor } from '../../hooks/useCanvas';
import { useTemplate } from '../../context/TemplateContext';
import './Canvas.css';

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const { setSelectedElement, initCanvas } = useEditor();
  const { currentTemplate, updateTemplate } = useTemplate();
  
  // Initialize Fabric canvas
  useEffect(() => {
    // Configure canvas for PDF dimensions (A4 paper size in pixels at 72 DPI)
    const canvasWidth = 595;
    const canvasHeight = 842;
    
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });
    
    // Add grid background for better visual guidance
    drawGrid(fabricRef.current);
    
    // Handle selection changes
    fabricRef.current.on('selection:created', handleSelectionChange);
    fabricRef.current.on('selection:updated', handleSelectionChange);
    fabricRef.current.on('selection:cleared', () => setSelectedElement(null));
    
    // Handle element modifications
    fabricRef.current.on('object:modified', handleObjectModified);
    
    // Pass canvas reference to context
    initCanvas(fabricRef.current);
    
    // Clean up on unmount
    return () => {
      fabricRef.current.dispose();
    };
  }, []);
  
  // Load template elements when template changes
  useEffect(() => {
    if (!fabricRef.current || !currentTemplate) return;
    
    // Clear canvas
    fabricRef.current.clear();
    drawGrid(fabricRef.current);
    
    // Load elements from template
    if (currentTemplate.elements && currentTemplate.elements.length > 0) {
      loadTemplateElements(currentTemplate.elements);
    }
  }, [currentTemplate]);
  
  const drawGrid = (canvas) => {
    // Create grid pattern
    const gridSize = 20;
    const gridColor = '#f0f0f0';
    
    for (let i = 0; i < (canvas.width / gridSize); i++) {
      canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
      }));
    }
    
    for (let i = 0; i < (canvas.height / gridSize); i++) {
      canvas.add(new fabric.Line([0, i * gridSize, canvas.width, i * gridSize], {
        stroke: gridColor,
        selectable: false,
        evented: false,
      }));
    }
    
    // Send grid to back
    canvas.getObjects().forEach(obj => {
      if (obj.type === 'line') {
        canvas.sendToBack(obj);
      }
    });
  };
  
  const handleSelectionChange = (e) => {
    const selectedObject = fabricRef.current.getActiveObject();
    if (selectedObject) {
      setSelectedElement({
        id: selectedObject.id,
        type: selectedObject.elementType,
        properties: {
          x: selectedObject.left,
          y: selectedObject.top,
          width: selectedObject.width * selectedObject.scaleX,
          height: selectedObject.height * selectedObject.scaleY,
          angle: selectedObject.angle,
          // Add other properties based on element type
          ...(selectedObject.elementType === 'text' && {
            text: selectedObject.text,
            fontSize: selectedObject.fontSize,
            fontFamily: selectedObject.fontFamily,
            textAlign: selectedObject.textAlign,
            fontWeight: selectedObject.fontWeight,
          }),
        },
        dataMapping: selectedObject.dataMapping || null,
      });
    }
  };
  
  const handleObjectModified = (e) => {
    const modifiedObject = e.target;
    
    // Update object in template
    if (currentTemplate && modifiedObject.id) {
      const updatedElements = currentTemplate.elements.map(element => {
        if (element.id === modifiedObject.id) {
          return {
            ...element,
            position: {
              x: modifiedObject.left,
              y: modifiedObject.top,
              width: modifiedObject.width * modifiedObject.scaleX,
              height: modifiedObject.height * modifiedObject.scaleY,
              angle: modifiedObject.angle,
            },
            // Update properties based on element type
            ...(element.type === 'text' && {
              properties: {
                ...element.properties,
                text: modifiedObject.text,
                fontSize: modifiedObject.fontSize,
                fontFamily: modifiedObject.fontFamily,
              }
            }),
          };
        }
        return element;
      });
      
      updateTemplate({
        ...currentTemplate,
        elements: updatedElements
      });
    }
  };
  
  const loadTemplateElements = (elements) => {
    elements.forEach(element => {
      let fabricObject;
      
      switch (element.type) {
        case 'text':
          fabricObject = new fabric.Textbox(element.properties.text || 'Text', {
            left: element.position.x,
            top: element.position.y,
            width: element.position.width,
            fontSize: element.properties.fontSize || 14,
            fontFamily: element.properties.fontFamily || 'Arial',
            textAlign: element.properties.textAlign || 'left',
            fontWeight: element.properties.fontWeight || 'normal',
            fill: element.properties.color || '#000000',
          });
          break;
          
        case 'image':
          // Load image from source
          fabric.Image.fromURL(element.properties.src, (img) => {
            img.set({
              left: element.position.x,
              top: element.position.y,
              scaleX: element.position.width / img.width,
              scaleY: element.position.height / img.height,
            });
            
            addFabricObjectProperties(img, element);
            fabricRef.current.add(img);
            fabricRef.current.renderAll();
          });
          return; // Skip the rest for image since it's async
          
        case 'rectangle':
          fabricObject = new fabric.Rect({
            left: element.position.x,
            top: element.position.y,
            width: element.position.width,
            height: element.position.height,
            fill: element.properties.fill || 'transparent',
            stroke: element.properties.stroke || '#000000',
            strokeWidth: element.properties.strokeWidth || 1,
            rx: element.properties.borderRadius || 0,
            ry: element.properties.borderRadius || 0,
          });
          break;
          
        default:
          console.warn(`Unknown element type: ${element.type}`);
          return;
      }
      
      if (fabricObject) {
        addFabricObjectProperties(fabricObject, element);
        fabricRef.current.add(fabricObject);
      }
    });
    
    fabricRef.current.renderAll();
  };
  
  const addFabricObjectProperties = (fabricObject, element) => {
    // Add metadata to fabric object
    fabricObject.id = element.id;
    fabricObject.elementType = element.type;
    fabricObject.dataMapping = element.dataMapping;
    
    // Set angle if defined
    if (element.position.angle) {
      fabricObject.set({ angle: element.position.angle });
    }
    
    // Add visual indicator for mapped fields
    if (element.dataMapping) {
      fabricObject.set({
        borderColor: '#4CAF50',
        cornerColor: '#4CAF50',
      });
    }
  };
  
  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} id="pdf-canvas" />
      </div>
    </div>
  );
};

export default Canvas;