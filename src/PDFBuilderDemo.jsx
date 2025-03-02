import React, { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';
const { Canvas } = fabric;

const PDFBuilderDemo = () => {
  const [mode, setMode] = useState('editor'); // editor, mapping, preview
  const [selectedElement, setSelectedElement] = useState(null);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  
  // Initialize canvas when component mounts
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create canvas with A4 dimensions
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: 595,
      height: 842,
      backgroundColor: '#ffffff',
      selection: true,
    });
    
    // Add grid for visual reference
    drawGrid(fabricCanvasRef.current);
    
    // Set up event handlers
    fabricCanvasRef.current.on('selection:created', handleSelectionChange);
    fabricCanvasRef.current.on('selection:updated', handleSelectionChange);
    fabricCanvasRef.current.on('selection:cleared', () => setSelectedElement(null));
    
    // Clean up on unmount
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);
  
  // Draw grid pattern on canvas
  const drawGrid = (canvas) => {
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
    
    canvas.renderAll();
  };
  
  // Handle element selection on canvas
  const handleSelectionChange = (e) => {
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      setSelectedElement({
        id: activeObject.id,
        type: activeObject.elementType,
        text: activeObject.text,
        left: activeObject.left,
        top: activeObject.top,
        width: activeObject.width * (activeObject.scaleX || 1),
        height: activeObject.height * (activeObject.scaleY || 1),
      });
    }
  };
  
  // Add new element to canvas
  const addElement = (type) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const elementId = `element-${Date.now()}`;
    
    let newObject;
    
    switch (type) {
      case 'text':
        newObject = new fabric.Textbox('Enter text here', {
          left: 100,
          top: 100,
          width: 200,
          fontSize: 16,
          fontFamily: 'Arial',
          fill: '#000000',
        });
        break;
        
      case 'rectangle':
        newObject = new fabric.Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 100,
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 1,
        });
        break;
        
      case 'circle':
        newObject = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 1,
        });
        break;
        
      case 'image':
        fabric.Image.fromURL('https://placeholder.com/200x100', (img) => {
          img.set({
            left: 100,
            top: 100,
            id: elementId,
            elementType: 'image',
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
        return;
        
      default:
        return;
    }
    
    if (newObject) {
      // Add metadata
      newObject.id = elementId;
      newObject.elementType = type;
      
      // Add to canvas
      canvas.add(newObject);
      canvas.setActiveObject(newObject);
      canvas.renderAll();
    }
  };
  
  // Button rendering helper
  const ElementButton = ({ type, label, onClick }) => (
    <button 
      className="element-button" 
      onClick={() => onClick(type)}
      style={{
        margin: '4px',
        padding: '8px 12px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  );
  
  // Property panel rendering
  const renderPropertyPanel = () => {
    if (!selectedElement) {
      return (
        <div className="property-panel-empty" style={{ padding: '16px', color: '#888' }}>
          Select an element to edit its properties
        </div>
      );
    }
    
    return (
      <div className="property-panel" style={{ padding: '16px' }}>
        <h3 style={{ marginTop: 0 }}>Properties: {selectedElement.type}</h3>
        
        <div className="property-group" style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '8px 0' }}>Position & Size</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginBottom: '8px' }}>
            <label>X:</label>
            <input 
              type="number" 
              value={Math.round(selectedElement.left)} 
              onChange={(e) => {
                if (fabricCanvasRef.current) {
                  const obj = fabricCanvasRef.current.getActiveObject();
                  if (obj) {
                    obj.set({ left: parseInt(e.target.value) });
                    fabricCanvasRef.current.renderAll();
                  }
                }
              }}
              style={{ padding: '4px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginBottom: '8px' }}>
            <label>Y:</label>
            <input 
              type="number" 
              value={Math.round(selectedElement.top)} 
              onChange={(e) => {
                if (fabricCanvasRef.current) {
                  const obj = fabricCanvasRef.current.getActiveObject();
                  if (obj) {
                    obj.set({ top: parseInt(e.target.value) });
                    fabricCanvasRef.current.renderAll();
                  }
                }
              }}
              style={{ padding: '4px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginBottom: '8px' }}>
            <label>Width:</label>
            <input 
              type="number" 
              value={Math.round(selectedElement.width)} 
              onChange={(e) => {
                if (fabricCanvasRef.current) {
                  const obj = fabricCanvasRef.current.getActiveObject();
                  if (obj) {
                    obj.set({ width: parseInt(e.target.value) });
                    obj.setCoords();
                    fabricCanvasRef.current.renderAll();
                  }
                }
              }}
              style={{ padding: '4px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
            <label>Height:</label>
            <input 
              type="number" 
              value={Math.round(selectedElement.height)} 
              onChange={(e) => {
                if (fabricCanvasRef.current) {
                  const obj = fabricCanvasRef.current.getActiveObject();
                  if (obj) {
                    obj.set({ height: parseInt(e.target.value) });
                    obj.setCoords();
                    fabricCanvasRef.current.renderAll();
                  }
                }
              }}
              style={{ padding: '4px' }}
            />
          </div>
        </div>
        
        {selectedElement.type === 'text' && (
          <div className="property-group" style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '8px 0' }}>Text Properties</h4>
            <div style={{ marginBottom: '8px' }}>
              <label>Text:</label>
              <textarea 
                value={selectedElement.text} 
                onChange={(e) => {
                  if (fabricCanvasRef.current) {
                    const obj = fabricCanvasRef.current.getActiveObject();
                    if (obj) {
                      obj.set({ text: e.target.value });
                      fabricCanvasRef.current.renderAll();
                    }
                  }
                }}
                style={{ width: '100%', padding: '4px', marginTop: '4px' }}
                rows={3}
              />
            </div>
          </div>
        )}
        
        <button 
          onClick={() => {
            if (fabricCanvasRef.current) {
              const obj = fabricCanvasRef.current.getActiveObject();
              if (obj) {
                fabricCanvasRef.current.remove(obj);
                fabricCanvasRef.current.renderAll();
                setSelectedElement(null);
              }
            }
          }}
          style={{
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete Element
        </button>
      </div>
    );
  };
  
  const renderPDFPreview = () => {
    return (
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <h3>PDF Preview</h3>
        <p>This is a placeholder for the PDF preview functionality.</p>
        <p>In a complete implementation, this would render a PDF preview with the elements from the canvas.</p>
        <button 
          onClick={() => setMode('editor')}
          style={{
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Editor
        </button>
      </div>
    );
  };
  
  const renderFieldMapping = () => {
    return (
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <h3>Field Mapping</h3>
        <p>This is a placeholder for the field mapping functionality.</p>
        <p>In a complete implementation, this would allow mapping database fields to template elements.</p>
        <button 
          onClick={() => setMode('editor')}
          style={{
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Editor
        </button>
      </div>
    );
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '800px' }}>
      <header style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>PDF Builder Demo</h2>
        <div>
          <button 
            onClick={() => setMode('editor')}
            style={{
              backgroundColor: mode === 'editor' ? '#3498db' : 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '6px 12px',
              marginRight: '8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Editor
          </button>
          <button 
            onClick={() => setMode('mapping')}
            style={{
              backgroundColor: mode === 'mapping' ? '#3498db' : 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '6px 12px',
              marginRight: '8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Field Mapping
          </button>
          <button 
            onClick={() => setMode('preview')}
            style={{
              backgroundColor: mode === 'preview' ? '#3498db' : 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Preview
          </button>
        </div>
      </header>
      
      {mode === 'editor' ? (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: '200px', backgroundColor: '#f8f8f8', padding: '16px', borderRight: '1px solid #ddd', overflow: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Elements</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <ElementButton type="text" label="Text" onClick={addElement} />
              <ElementButton type="rectangle" label="Rectangle" onClick={addElement} />
              <ElementButton type="circle" label="Circle" onClick={addElement} />
              <ElementButton type="image" label="Image" onClick={addElement} />
            </div>
          </div>
          
          <div style={{ flex: 1, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto', padding: '16px' }}>
            <canvas ref={canvasRef} style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }} />
          </div>
          
          <div style={{ width: '250px', backgroundColor: '#f8f8f8', borderLeft: '1px solid #ddd', overflow: 'auto' }}>
            {renderPropertyPanel()}
          </div>
        </div>
      ) : mode === 'mapping' ? (
        renderFieldMapping()
      ) : (
        renderPDFPreview()
      )}
      
      <footer style={{ padding: '12px 16px', backgroundColor: '#f5f5f5', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          style={{
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            marginRight: '8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Save Template
        </button>
        <button 
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export PDF
        </button>
      </footer>
    </div>
  );
};

export default PDFBuilderDemo;