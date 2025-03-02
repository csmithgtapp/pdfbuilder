import React, { useState } from 'react';
import './App.css';
import Editor from './components/Editor';
import Toolbar from './components/Editor/Toolbar';
import PropertyPanel from './components/Editor/PropertyPanel';
import FieldMapping from './components/FieldMapping';
import PDFPreview from './components/Preview/PDFPreview';
import { EditorProvider } from './context/EditorContext';
import { TemplateProvider } from './context/TemplateContext';

function App() {
  const [viewMode, setViewMode] = useState('editor'); // editor, preview, mapping

  return (
    <TemplateProvider>
      <EditorProvider>
        <div className="app-container">
          <header className="app-header">
            <h1>PDF Template Builder</h1>
            <div className="view-toggles">
              <button 
                className={viewMode === 'editor' ? 'active' : ''}
                onClick={() => setViewMode('editor')}
              >
                Editor
              </button>
              <button 
                className={viewMode === 'mapping' ? 'active' : ''}
                onClick={() => setViewMode('mapping')}
              >
                Field Mapping
              </button>
              <button 
                className={viewMode === 'preview' ? 'active' : ''}
                onClick={() => setViewMode('preview')}
              >
                Preview
              </button>
            </div>
          </header>
          
          <main className="app-content">
            {viewMode === 'editor' && (
              <>
                <Toolbar />
                <Editor />
                <PropertyPanel />
              </>
            )}
            
            {viewMode === 'mapping' && (
              <FieldMapping />
            )}
            
            {viewMode === 'preview' && (
              <PDFPreview />
            )}
          </main>
          
          <footer className="app-footer">
            <button className="save-button">Save Template</button>
            <button className="export-button">Export PDF</button>
          </footer>
        </div>
      </EditorProvider>
    </TemplateProvider>
  );
}

export default App;