import React from 'react';
import { useTemplate } from '../../context/TemplateContext';
import './MappingModal.css';

const MappingModal = ({ fieldPath, onMapField }) => {
  const { currentTemplate } = useTemplate();
  
  // Get mappable elements (text, image, table, etc.)
  const getMappableElements = () => {
    if (!currentTemplate || !currentTemplate.elements) return [];
    
    return currentTemplate.elements.filter(element => 
      ['text', 'paragraph', 'image', 'table'].includes(element.type)
    );
  };
  
  // Get element display name
  const getElementDisplayName = (element) => {
    if (element.type === 'text' || element.type === 'paragraph') {
      return element.properties.text.substring(0, 20) + (element.properties.text.length > 20 ? '...' : '');
    }
    
    return `${element.type} (${element.id.substring(0, 8)})`;
  };
  
  return (
    <div className="mapping-modal">
      <h4>Map Field "{fieldPath}" to:</h4>
      
      <div className="mappable-elements">
        {getMappableElements().length === 0 ? (
          <p className="no-elements">No mappable elements in the template. Add text or other elements first.</p>
        ) : (
          <ul className="elements-list">
            {getMappableElements().map(element => (
              <li key={element.id} className="element-item">
                <div className="element-info">
                  <span className="element-type">{element.type}</span>
                  <span className="element-name">{getElementDisplayName(element)}</span>
                </div>
                
                <button 
                  className="map-button"
                  onClick={() => onMapField(element.id, fieldPath)}
                  disabled={element.dataMapping === fieldPath}
                >
                  {element.dataMapping === fieldPath ? 'Mapped' : 'Map'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MappingModal;