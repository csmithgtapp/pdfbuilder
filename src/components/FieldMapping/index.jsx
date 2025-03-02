import React from 'react';
import FieldSelector from './FieldSelector';
import MappingModal from './MappingModal';
import { useFieldMapping } from '../../hooks/useFieldMapping';
import './FieldMapping.css';

const FieldMapping = () => {
  const { selectedField, setSelectedField, mapFieldToElement, getMappedElements } = useFieldMapping();
  
  return (
    <div className="field-mapping-container">
      <div className="mapping-header">
        <h3>Data Field Mapping</h3>
      </div>
      
      <div className="mapping-content">
        <div className="schema-explorer">
          <FieldSelector 
            selectedField={selectedField}
            onSelectField={setSelectedField}
          />
          
          <div className="mapping-panel">
            {selectedField && (
              <MappingModal 
                fieldPath={selectedField}
                onMapField={mapFieldToElement}
              />
            )}
            
            <div className="current-mappings">
              <h4>Current Mappings</h4>
              <div className="mappings-list">
                {getMappedElements().map(element => (
                  <div key={element.id} className="mapping-item">
                    <span className="element-type">{element.type}</span>
                    <span className="mapping-arrow">→</span>
                    <span className="field-path">{element.dataMapping}</span>
                  </div>
                ))}
                
                {getMappedElements().length === 0 && (
                  <p className="no-mappings">No field mappings defined yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldMapping;