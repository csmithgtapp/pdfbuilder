import React from 'react';
import { useEditor } from '../../hooks/useCanvas';
import { useTemplate } from '../../context/TemplateContext';
import './PropertyPanel.css';

const PropertyPanel = () => {
  const { selectedElement, updateSelectedElement } = useEditor();
  const { currentTemplate, updateTemplate } = useTemplate();
  
  if (!selectedElement) {
    return (
      <div className="property-panel">
        <div className="panel-header">
          <h3>Properties</h3>
        </div>
        <div className="panel-content empty">
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }
  
  const handlePropertyChange = (propName, value) => {
    // Update selected element in editor state
    updateSelectedElement({
      ...selectedElement,
      properties: {
        ...selectedElement.properties,
        [propName]: value
      }
    });
    
    // Update element in template
    if (currentTemplate) {
      const updatedElements = currentTemplate.elements.map(element => {
        if (element.id === selectedElement.id) {
          return {
            ...element,
            properties: {
              ...element.properties,
              [propName]: value
            }
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
  
  const handlePositionChange = (positionProp, value) => {
    // Update selected element in editor state
    updateSelectedElement({
      ...selectedElement,
      position: {
        ...selectedElement.position,
        [positionProp]: value
      }
    });
    
    // Update element in template
    if (currentTemplate) {
      const updatedElements = currentTemplate.elements.map(element => {
        if (element.id === selectedElement.id) {
          return {
            ...element,
            position: {
              ...element.position,
              [positionProp]: value
            }
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
  
  const handleDataMappingChange = (mapping) => {
    // Update selected element in editor state
    updateSelectedElement({
      ...selectedElement,
      dataMapping: mapping
    });
    
    // Update element in template
    if (currentTemplate) {
      const updatedElements = currentTemplate.elements.map(element => {
        if (element.id === selectedElement.id) {
          return {
            ...element,
            dataMapping: mapping
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
  
  const renderCommonProperties = () => (
    <div className="property-group">
      <h4>Position & Size</h4>
      <div className="property-row">
        <label>X:</label>
        <input 
          type="number" 
          value={selectedElement.position.x || 0} 
          onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
        />
      </div>
      <div className="property-row">
        <label>Y:</label>
        <input 
          type="number" 
          value={selectedElement.position.y || 0} 
          onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
        />
      </div>
      <div className="property-row">
        <label>Width:</label>
        <input 
          type="number" 
          value={selectedElement.position.width || 100} 
          onChange={(e) => handlePositionChange('width', parseInt(e.target.value))}
        />
      </div>
      <div className="property-row">
        <label>Height:</label>
        <input 
          type="number" 
          value={selectedElement.position.height || 100} 
          onChange={(e) => handlePositionChange('height', parseInt(e.target.value))}
        />
      </div>
      <div className="property-row">
        <label>Rotation:</label>
        <input 
          type="number" 
          min="0"
          max="360"
          value={selectedElement.position.angle || 0} 
          onChange={(e) => handlePositionChange('angle', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
  
  const renderDataMapping = () => (
    <div className="property-group">
      <h4>Data Mapping</h4>
      <div className="property-row">
        <label>Data Field:</label>
        <input 
          type="text" 
          placeholder="e.g., customer.name"
          value={selectedElement.dataMapping || ''} 
          onChange={(e) => handleDataMappingChange(e.target.value)}
        />
      </div>
      <button className="small-button">
        Choose Field
      </button>
    </div>
  );
  
  const renderSpecificProperties = () => {
    switch (selectedElement.type) {
      case 'text':
      case 'paragraph':
        return (
          <div className="property-group">
            <h4>Text Properties</h4>
            <div className="property-row">
              <label>Text:</label>
              <textarea 
                value={selectedElement.properties?.text || ''} 
                onChange={(e) => handlePropertyChange('text', e.target.value)}
              />
            </div>
            <div className="property-row">
              <label>Font:</label>
              <select 
                value={selectedElement.properties?.fontFamily || 'Arial'} 
                onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Helvetica">Helvetica</option>
              </select>
            </div>
            <div className="property-row">
              <label>Size:</label>
              <input 
                type="number" 
                min="6"
                max="72"
                value={selectedElement.properties?.fontSize || 14} 
                onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
              />
            </div>
            <div className="property-row">
              <label>Color:</label>
              <input 
                type="color" 
                value={selectedElement.properties?.color || '#000000'} 
                onChange={(e) => handlePropertyChange('color', e.target.value)}
              />
            </div>
            <div className="property-row">
              <label>Alignment:</label>
              <select 
                value={selectedElement.properties?.textAlign || 'left'} 
                onChange={(e) => handlePropertyChange('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div className="property-row">
              <label>Weight:</label>
              <select 
                value={selectedElement.properties?.fontWeight || 'normal'} 
                onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="property-group">
            <h4>Image Properties</h4>
            <div className="property-row">
              <label>Source:</label>
              <input 
                type="text" 
                value={selectedElement.properties?.src || ''} 
                onChange={(e) => handlePropertyChange('src', e.target.value)}
              />
            </div>
            <button className="small-button">
              Upload Image
            </button>
            <div className="property-row">
              <label>Alt Text:</label>
              <input 
                type="text" 
                value={selectedElement.properties?.alt || ''} 
                onChange={(e) => handlePropertyChange('alt', e.target.value)}
              />
            </div>
          </div>
        );
        
      case 'rectangle':
      case 'circle':
        return (
          <div className="property-group">
            <h4>Shape Properties</h4>
            <div className="property-row">
              <label>Fill:</label>
              <input 
                type="color" 
                value={selectedElement.properties?.fill || 'transparent'} 
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
              />
            </div>
            <div className="property-row">
              <label>Stroke:</label>
              <input 
                type="color" 
                value={selectedElement.properties?.stroke || '#000000'} 
                onChange={(e) => handlePropertyChange('stroke', e.target.value)}
              />
            </div>
            <div className="property-row">
              <label>Stroke Width:</label>
              <input 
                type="number" 
                min="0"
                max="20"
                value={selectedElement.properties?.strokeWidth || 1} 
                onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value))}
              />
            </div>
            {selectedElement.type === 'rectangle' && (
              <div className="property-row">
                <label>Border Radius:</label>
                <input 
                  type="number" 
                  min="0"
                  max="50"
                  value={selectedElement.properties?.borderRadius || 0} 
                  onChange={(e) => handlePropertyChange('borderRadius', parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        );
        
      case 'table':
        return (
          <div className="property-group">
            <h4>Table Properties</h4>
            <div className="property-row">
              <label>Columns:</label>
              <input 
                type="number" 
                min="1"
                max="10"
                value={selectedElement.properties?.columns || 3} 
                onChange={(e) => handlePropertyChange('columns', parseInt(e.target.value))}
              />
            </div>
            <div className="property-row">
              <label>Rows:</label>
              <input 
                type="number" 
                min="1"
                max="20"
                value={selectedElement.properties?.rows || 3} 
                onChange={(e) => handlePropertyChange('rows', parseInt(e.target.value))}
              />
            </div>
            <div className="property-row">
              <label>Header Row:</label>
              <input 
                type="checkbox" 
                checked={selectedElement.properties?.headerRow || false} 
                onChange={(e) => handlePropertyChange('headerRow', e.target.checked)}
              />
            </div>
            <div className="property-row">
              <label>Bordered:</label>
              <input 
                type="checkbox" 
                checked={selectedElement.properties?.bordered || true} 
                onChange={(e) => handlePropertyChange('bordered', e.target.checked)}
              />
            </div>
            <div className="property-row">
              <label>Cell Padding:</label>
              <input 
                type="number" 
                min="0"
                max="20"
                value={selectedElement.properties?.cellPadding || 5} 
                onChange={(e) => handlePropertyChange('cellPadding', parseInt(e.target.value))}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="property-panel">
      <div className="panel-header">
        <h3>Properties: {selectedElement.type}</h3>
      </div>
      <div className="panel-content">
        {renderCommonProperties()}
        {renderSpecificProperties()}
        {renderDataMapping()}
        
        <div className="property-group actions">
          <button className="delete-button">Delete Element</button>
          <button className="duplicate-button">Duplicate</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;