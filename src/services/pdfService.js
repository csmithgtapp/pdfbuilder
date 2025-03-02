import { jsPDF } from 'jspdf';
import { fabric } from 'fabric';

// Generate PDF from template with data
export const generatePDF = async (template, data = {}) => {
  try {
    // Create a canvas for rendering
    const canvasEl = document.createElement('canvas');
    canvasEl.width = 595; // A4 width at 72 DPI
    canvasEl.height = 842; // A4 height at 72 DPI
    
    const canvas = new fabric.Canvas(canvasEl, {
      width: 595,
      height: 842,
      backgroundColor: '#ffffff',
      selection: false,
      interactive: false,
    });
    
    // Render elements with data
    await renderElementsWithData(canvas, template.elements, data);
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
    
    // Convert canvas to image
    const imgData = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Render elements with data binding
const renderElementsWithData = async (canvas, elements, data) => {
  if (!elements || !elements.length) return;
  
  for (const element of elements) {
    let fabricObject;
    
    // Get mapped data if available
    const mappedValue = element.dataMapping ? getNestedValue(data, element.dataMapping) : null;
    
    switch (element.type) {
      case 'text':
      case 'paragraph':
        // Replace template text with data if mapped
        const textContent = mappedValue !== null ? String(mappedValue) : element.properties.text;
        
        fabricObject = new fabric.Textbox(textContent, {
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
        // Use mapped data URL if available
        const imgSrc = mappedValue || element.properties.src;
        
        // Create image object (wrapped in promise for async loading)
        await new Promise((resolve) => {
          fabric.Image.fromURL(imgSrc, (img) => {
            img.set({
              left: element.position.x,
              top: element.position.y,
              scaleX: element.position.width / img.width,
              scaleY: element.position.height / img.height,
            });
            
            if (element.position.angle) {
              img.set({ angle: element.position.angle });
            }
            
            canvas.add(img);
            resolve();
          });
        });
        continue; // Skip the rest for image since we've already added it
        
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
        continue;
    }
    
    if (fabricObject) {
      // Apply rotation if specified
      if (element.position.angle) {
        fabricObject.set({ angle: element.position.angle });
      }
      
      canvas.add(fabricObject);
    }
  }
  
  canvas.renderAll();
};

// Helper function to get a nested value from an object using a path string
const getNestedValue = (obj, path) => {
  try {
    // Handle array paths like "items[0].name"
    const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
    const parts = normalizedPath.split('.');
    
    let result = obj;
    for (const part of parts) {
      if (result == null) {
        return null;
      }
      result = result[part];
    }
    
    return result;
  } catch (error) {
    console.error(`Error accessing path ${path}:`, error);
    return null;
  }
};

// Save PDF to file
export const savePDF = (pdf, filename = 'document.pdf') => {
  pdf.save(filename);
};

// Open PDF in new window
export const previewPDF = (pdf) => {
  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};