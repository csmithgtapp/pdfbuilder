import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { fabric } from 'fabric';
import { useTemplate } from '../../context/TemplateContext';
import './PDFPreview.css';

const PDFPreview = () => {
  const { currentTemplate } = useTemplate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sampleData, setSampleData] = useState({
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345'
      }
    },
    invoice: {
      number: 'INV-001',
      date: '2023-05-15',
      items: [
        {
          description: 'Product A',
          quantity: 2,
          price: 50,
          total: 100
        },
        {
          description: 'Product B',
          quantity: 1,
          price: 75,
          total: 75
        }
      ],
      total: 175
    }
  });
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  
  useEffect(() => {
    generatePreview();
  }, [currentTemplate, sampleData]);
  
  const generatePreview = async () => {
    if (!currentTemplate) return;
    
    try {
      // Setup canvas for rendering
      const canvasWidth = 595; // A4 width in points
      const canvasHeight = 842; // A4 height in points
      
      if (!fabricRef.current) {
        fabricRef.current = new fabric.Canvas(canvasRef.current, {
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: '#ffffff',
          selection: false,
          interactive: false,
        });
      } else {
        fabricRef.current.clear();
        fabricRef.current.setBackgroundColor('#ffffff', fabricRef.current.renderAll.bind(fabricRef.current));
      }
      
      // Render elements with data binding
      await renderElementsWithData(fabricRef.current, currentTemplate.elements, sampleData);
      
      // Convert to PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      
      // Convert canvas to image
      const imgData = fabricRef.current.toDataURL({
        format: 'png',
        quality: 1,
      });
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight);
      
      // Generate PDF URL
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPreviewUrl(pdfUrl);
      
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    }
  };
  
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
  
  return (
    <div className="pdf-preview-container">
      <div className="preview-header">
        <h3>PDF Preview with Sample Data</h3>
        <button 
          className="refresh-button"
          onClick={generatePreview}
        >
          Refresh Preview
        </button>
      </div>
      
      <div className="preview-content">
        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {previewUrl ? (
          <div className="pdf-container">
            <iframe 
              src={previewUrl} 
              title="PDF Preview" 
              className="pdf-iframe"
            />
          </div>
        ) : (
          <div className="preview-placeholder">
            <p>Loading preview...</p>
          </div>
        )}
      </div>
      
      <div className="sample-data-editor">
        <h4>Edit Sample Data</h4>
        <textarea
          className="data-textarea"
          value={JSON.stringify(sampleData, null, 2)}
          onChange={(e) => {
            try {
              setSampleData(JSON.parse(e.target.value));
            } catch (err) {
              // Ignore parse errors while typing
            }
          }}
        />
      </div>
    </div>
  );
};

export default PDFPreview;