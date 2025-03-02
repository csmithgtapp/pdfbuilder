import React, { useState } from 'react';
import './App.css';
import { EditorProvider } from './context/EditorContext';
import { TemplateProvider } from './context/TemplateContext';
import PDFBuilderDemo from './PDFBuilderDemo';

function App() {
  return (
    <div className="App" style={{ height: '100vh' }}>
      <PDFBuilderDemo />
    </div>
  );
}

export default App;