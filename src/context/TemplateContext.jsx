import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const TemplateContext = createContext();

// Custom hook to use the template context
export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};

// Provider component
export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with a blank template
  useEffect(() => {
    createNewTemplate();
  }, []);

  // Create a new blank template
  const createNewTemplate = () => {
    const newTemplate = {
      id: `template-${Date.now()}`,
      name: 'Untitled Template',
      description: '',
      pageSize: 'a4',
      orientation: 'portrait',
      elements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentTemplate(newTemplate);
    setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
    
    return newTemplate;
  };

  // Update the current template
  const updateTemplate = (updatedTemplate) => {
    // Update the template
    setCurrentTemplate({
      ...updatedTemplate,
      updatedAt: new Date().toISOString()
    });
    
    // Also update in the templates list
    setTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.id === updatedTemplate.id 
          ? { ...updatedTemplate, updatedAt: new Date().toISOString() } 
          : template
      )
    );
  };

  // Add an element to the current template
  const addElementToTemplate = (element) => {
    if (!currentTemplate) return null;
    
    const updatedTemplate = {
      ...currentTemplate,
      elements: [...currentTemplate.elements, element],
      updatedAt: new Date().toISOString()
    };
    
    setCurrentTemplate(updatedTemplate);
    
    // Also update in the templates list
    setTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.id === currentTemplate.id ? updatedTemplate : template
      )
    );
    
    return element;
  };
  
  // Value provided by the context
  const value = {
    templates,
    currentTemplate,
    isLoading,
    error,
    setError,
    createNewTemplate,
    updateTemplate,
    addElementToTemplate
  };
  
  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateContext;