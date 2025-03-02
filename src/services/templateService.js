// Template service for saving, loading, and managing templates

// Save template to localStorage
export const saveTemplate = (template) => {
    try {
      // Get existing templates
      const templates = getTemplates();
      
      // Check if template already exists
      const index = templates.findIndex(t => t.id === template.id);
      
      if (index >= 0) {
        // Update existing template
        templates[index] = template;
      } else {
        // Add new template
        templates.push(template);
      }
      
      // Save to localStorage
      localStorage.setItem('pdfBuilderTemplates', JSON.stringify(templates));
      
      return true;
    } catch (error) {
      console.error('Error saving template:', error);
      return false;
    }
  };
  
  // Get all templates from localStorage
  export const getTemplates = () => {
    try {
      const templates = localStorage.getItem('pdfBuilderTemplates');
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  };
  
  // Get a specific template by ID
  export const getTemplateById = (id) => {
    try {
      const templates = getTemplates();
      return templates.find(template => template.id === id);
    } catch (error) {
      console.error('Error getting template by ID:', error);
      return null;
    }
  };
  
  // Delete a template by ID
  export const deleteTemplate = (id) => {
    try {
      const templates = getTemplates();
      const filteredTemplates = templates.filter(template => template.id !== id);
      localStorage.setItem('pdfBuilderTemplates', JSON.stringify(filteredTemplates));
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  };
  
  // Export template as JSON file
  export const exportTemplate = (template) => {
    try {
      const templateString = JSON.stringify(template, null, 2);
      const blob = new Blob([templateString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name || 'template'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error exporting template:', error);
      return false;
    }
  };
  
  // Import template from JSON file
  export const importTemplate = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const template = JSON.parse(event.target.result);
          resolve(template);
        } catch (error) {
          console.error('Error parsing template file:', error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading template file:', error);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };