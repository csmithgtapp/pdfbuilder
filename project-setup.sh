#!/bin/bash

# Navigate to your project directory
cd /home/gts/PDFBuilder

# Create the main src directory
mkdir -p src

# Create components directories
mkdir -p src/components/Editor
mkdir -p src/components/Elements
mkdir -p src/components/FieldMapping
mkdir -p src/components/Preview

# Create hooks directory
mkdir -p src/hooks

# Create services directory
mkdir -p src/services

# Create context directory
mkdir -p src/context

# Create Editor component files
touch src/components/Editor/Canvas.jsx
touch src/components/Editor/Toolbar.jsx
touch src/components/Editor/PropertyPanel.jsx
touch src/components/Editor/index.jsx

# Create Elements component files
touch src/components/Elements/TextElement.jsx
touch src/components/Elements/ImageElement.jsx
touch src/components/Elements/TableElement.jsx
touch src/components/Elements/ShapeElement.jsx
touch src/components/Elements/index.jsx

# Create FieldMapping component files
touch src/components/FieldMapping/FieldSelector.jsx
touch src/components/FieldMapping/MappingModal.jsx
touch src/components/FieldMapping/index.jsx

# Create Preview component files
touch src/components/Preview/PDFPreview.jsx
touch src/components/Preview/index.jsx

# Create hooks files
touch src/hooks/useCanvas.js
touch src/hooks/useFieldMapping.js

# Create services files
touch src/services/templateService.js
touch src/services/pdfService.js

# Create context files
touch src/context/EditorContext.jsx
touch src/context/TemplateContext.jsx

# Create main app files
touch src/App.jsx
touch src/index.js

echo "Project structure created successfully!"
