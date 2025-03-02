import { useEffect } from 'react';
import { useEditor } from '../context/EditorContext';
import { useTemplate } from '../context/TemplateContext';

export const useCanvas = () => {
  const editorContext = useEditor();
  const templateContext = useTemplate();
  
  useEffect(() => {
    // Sync changes from editor to template when selected element changes
    if (editorContext.selectedElement && templateContext.currentTemplate) {
      const { selectedElement } = editorContext;
      
      // Find element in template
      const elementIndex = templateContext.currentTemplate.elements.findIndex(
        el => el.id === selectedElement.id
      );
      
      // If element exists in template, update it with changes from editor
      if (elementIndex !== -1) {
        const updatedElements = [...templateContext.currentTemplate.elements];
        updatedElements[elementIndex] = {
          ...updatedElements[elementIndex],
          position: selectedElement.position,
          properties: selectedElement.properties,
          dataMapping: selectedElement.dataMapping,
        };
        
        // Update template with changes
        templateContext.updateTemplate({
          ...templateContext.currentTemplate,
          elements: updatedElements,
        });
      }
    }
  }, [editorContext.selectedElement]);
  
  // Helper function to add a new element to both the canvas and template
  const addElement = (elementType, properties = {}) => {
    if (!editorContext.fabricCanvas || !templateContext.currentTemplate) return null;
    
    // Generate element ID
    const elementId = `element-${Date.now()}`;
    
    // Get canvas center
    const canvasCenter = editorContext.fabricCanvas.getCenter();
    
    // Create new element configuration
    const newElement = {
      id: elementId,
      type: elementType,
      position: {
        x: canvasCenter.left - 100,
        y: canvasCenter.top - 50,
        width: 200,
        height: 100,
        angle: 0,
      },
      properties: {
        // Default properties based on element type
        ...getDefaultPropertiesForType(elementType),
        ...properties,
      },
      dataMapping: null,
    };
    
    // Add element to template
    templateContext.addElementToTemplate(newElement);
    
    return newElement;
  };
  
  // Helper function to get default properties for each element type
  const getDefaultPropertiesForType = (type) => {
    switch (type) {
      case 'text':
        return {
          text: 'Enter text here',
          fontSize: 16,
          fontFamily: 'Arial',
          textAlign: 'left',
          color: '#000000',
          fontWeight: 'normal',
        };
      default:
        return {};
    }
  };
  
  // Return combined functionality from both contexts plus helper functions
  return {
    // Editor context
    ...editorContext,
    
    // Template context
    template: templateContext.currentTemplate,
    updateTemplate: templateContext.updateTemplate,
    
    // Helper functions
    addElement,
  };
};

export default useCanvas;