import { useState } from 'react';
import { useTemplate } from '../context/TemplateContext';

export const useFieldMapping = () => {
  const { currentTemplate, updateTemplate } = useTemplate();
  const [selectedField, setSelectedField] = useState(null);
  
  // Map a data field to an element
  const mapFieldToElement = (elementId, fieldPath) => {
    if (!currentTemplate) return false;
    
    const updatedElements = currentTemplate.elements.map(element => {
      if (element.id === elementId) {
        return {
          ...element,
          dataMapping: fieldPath
        };
      }
      return element;
    });
    
    updateTemplate({
      ...currentTemplate,
      elements: updatedElements
    });
    
    return true;
  };
  
  // Remove mapping from an element
  const removeFieldMapping = (elementId) => {
    if (!currentTemplate) return false;
    
    const updatedElements = currentTemplate.elements.map(element => {
      if (element.id === elementId) {
        return {
          ...element,
          dataMapping: null
        };
      }
      return element;
    });
    
    updateTemplate({
      ...currentTemplate,
      elements: updatedElements
    });
    
    return true;
  };
  
  // Get all mapped elements
  const getMappedElements = () => {
    if (!currentTemplate) return [];
    
    return currentTemplate.elements.filter(element => element.dataMapping);
  };
  
  return {
    selectedField,
    setSelectedField,
    mapFieldToElement,
    removeFieldMapping,
    getMappedElements
  };
};

export default useFieldMapping;