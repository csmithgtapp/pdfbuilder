import React from 'react';
import { 
  FaFont, 
  FaImage, 
  FaTable, 
  FaSquare, 
  FaCircle, 
  FaParagraph,
  FaBarcode,
  FaCalculator,
  FaSignature
} from 'react-icons/fa';
import { useEditor } from '../../hooks/useCanvas';
import { useTemplate } from '../../context/TemplateContext';
import './Toolbar.css';

const Toolbar = () => {
  const { fabricCanvas } = useEditor();
  const { currentTemplate, updateTemplate } = useTemplate();
  
  const addElement = (type) => {
    if (!fabricCanvas || !currentTemplate) return;
    
    // Generate unique ID
    const elementId = `element-${Date.now()}`;
    const canvasCenter = fabricCanvas.getCenter();
    
    let newElement = {
      id: elementId,
      type: type,
      position: {
        x: canvasCenter.left - 100,
        y: canvasCenter.top - 50,
        width: 200,
        height: 100,
        angle: 0
      },
      dataMapping: null
    };
    
    // Set element-specific properties
    switch (type) {
      case 'text':
        newElement.properties = {
          text: 'Enter text here',
          fontSize: 16,
          fontFamily: 'Arial',
          textAlign: 'left',
          color: '#000000',
          fontWeight: 'normal'
        };
        newElement.position.height = 40;
        break;
        
      case 'paragraph':
        newElement.properties = {
          text: 'Enter paragraph text here. This can be a longer block of text that wraps to multiple lines.',
          fontSize: 12,
          fontFamily: 'Arial',
          textAlign: 'left',
          color: '#000000',
          lineHeight: 1.2
        };
        newElement.position.height = 100;
        break;
        
      case 'image':
        newElement.properties = {
          src: 'https://via.placeholder.com/200x100',
          alt: 'Placeholder image'
        };
        break;
        
      case 'rectangle':
        newElement.properties = {
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 1,
          borderRadius: 0
        };
        break;
        
      case 'circle':
        newElement.properties = {
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 1,
          radius: 50
        };
        newElement.position.width = 100;
        newElement.position.height = 100;
        break;
        
      case 'table':
        newElement.properties = {
          columns: 3,
          rows: 3,
          headerRow: true,
          bordered: true,
          cellPadding: 5
        };
        break;
        
      case 'barcode':
        newElement.properties = {
          format: 'CODE128',
          value: '123456789',
          displayValue: true
        };
        newElement.position.height = 80;
        break;
        
      case 'formula':
        newElement.properties = {
          expression: 'SUM({items.price})',
          format: 'currency',
          prefix: '$'
        };
        newElement.position.height = 30;
        break;
        
      case 'signature':
        newElement.properties = {
          label: 'Signature',
          required: true,
          border: true
        };
        newElement.position.height = 60;
        break;
        
      default:
        console.warn(`Unknown element type: ${type}`);
        return;
    }
    
    // Add element to template
    const updatedTemplate = {
      ...currentTemplate,
      elements: [...(currentTemplate.elements || []), newElement]
    };
    
    updateTemplate(updatedTemplate);
  };
  
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Elements</h3>
        <div className="toolbar-buttons">
          <button 
            className="toolbar-button" 
            onClick={() => addElement('text')}
            title="Add Text Field"
          >
            <FaFont /> <span>Text</span>
          </button>
          
          <button 
            className="toolbar-button" 
            onClick={() => addElement('paragraph')}
            title="Add Paragraph"
          >
            <FaParagraph /> <span>Paragraph</span>
          </button>
          
          <button 
            className="toolbar-button" 
            onClick={() => addElement('image')}
            title="Add Image"
          >
            <FaImage /> <span>Image</span>
          </button>
          
          <button 
            className="toolbar-button" 
            onClick={() => addElement('rectangle')}
            title="Add Rectangle"
          >
            <FaSquare /> <span>Rectangle</span>
          </button>
          
          <button 
            className="toolbar-button" 
            onClick={() => addElement('circle')}
            title="Add Circle"
          >
            <FaCircle /> <span>Circle</span>
          </button>
          
          <button 
            className="toolbar-button" 
            onClick={() => addElement('table')}
            title="Add Table"
          >
            <FaTable /> <span>Table</span>
          </button>
          
          <button 
            className="toolbar-button" 
            onClick={() => addElement('barcode')}
            title="Add Barcode/QR Code"
          >
            <FaBarcode /> <span>Barcode</span>
          </button>
          
          <button 
            className="toolbar-button" 
            onClick={() => addElement('formula')}
            title="Add Formula/Calculation"
          >
            <FaCalculator /> <span>Formula</span>
          </button>
          
          <button 
            className="toolbar-button" 
            onClick={() => addElement('signature')}
            title="Add Signature Field"
          >
            <FaSignature /> <span>Signature</span>
          </button>
        </div>
      </div>
      
      <div className="toolbar-section">
        <h3>Template</h3>
        <div className="toolbar-buttons">
          <button className="toolbar-button" title="New Template">
            New
          </button>
          <button className="toolbar-button" title="Save Template">
            Save
          </button>
          <button className="toolbar-button" title="Load Template">
            Load
          </button>
        </div>
      </div>
      
      <div className="toolbar-section">
        <h3>Page</h3>
        <div className="toolbar-buttons">
          <select className="page-size-select" title="Page Size">
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
            <option value="custom">Custom</option>
          </select>
          
          <select className="page-orientation-select" title="Page Orientation">
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;