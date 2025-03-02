import React, { useState } from 'react';
import './FieldSelector.css';

const sampleSchema = {
  type: 'object',
  properties: {
    customer: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zip: { type: 'string' }
          }
        }
      }
    },
    invoice: {
      type: 'object',
      properties: {
        number: { type: 'string' },
        date: { type: 'string', format: 'date' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              quantity: { type: 'number' },
              price: { type: 'number' },
              total: { type: 'number' }
            }
          }
        },
        total: { type: 'number' }
      }
    }
  }
};

const FieldSelector = ({ selectedField, onSelectField }) => {
  const [expandedNodes, setExpandedNodes] = useState(['customer', 'invoice']);
  
  const toggleNode = (path) => {
    if (expandedNodes.includes(path)) {
      setExpandedNodes(expandedNodes.filter(p => p !== path));
    } else {
      setExpandedNodes([...expandedNodes, path]);
    }
  };
  
  const renderSchemaNode = (schema, path = '', label = 'root', depth = 0) => {
    if (!schema || typeof schema !== 'object') return null;
    
    if (schema.type === 'object' && schema.properties) {
      const isExpanded = expandedNodes.includes(path);
      
      return (
        <div className="schema-node" key={path || 'root'}>
          <div 
            className="node-header" 
            style={{ paddingLeft: `${depth * 16}px` }}
            onClick={() => toggleNode(path)}
          >
            <span className={`expander ${isExpanded ? 'expanded' : ''}`}>
              {isExpanded ? '▼' : '►'}
            </span>
            <span 
              className={`node-label ${selectedField === path ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectField(path);
              }}
            >
              {label}
            </span>
            <span className="node-type">object</span>
          </div>
          
          {isExpanded && (
            <div className="node-children">
              {Object.keys(schema.properties).map(key => {
                const childPath = path ? `${path}.${key}` : key;
                return renderSchemaNode(schema.properties[key], childPath, key, depth + 1);
              })}
            </div>
          )}
        </div>
      );
    } else if (schema.type === 'array' && schema.items) {
      const isExpanded = expandedNodes.includes(path);
      
      return (
        <div className="schema-node" key={path}>
          <div 
            className="node-header" 
            style={{ paddingLeft: `${depth * 16}px` }}
            onClick={() => toggleNode(path)}
          >
            <span className={`expander ${isExpanded ? 'expanded' : ''}`}>
              {isExpanded ? '▼' : '►'}
            </span>
            <span 
              className={`node-label ${selectedField === path ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectField(path);
              }}
            >
              {label}
            </span>
            <span className="node-type">array</span>
          </div>
          
          {isExpanded && schema.items.type === 'object' && schema.items.properties && (
            <div className="node-children">
              <div className="array-item-indicator" style={{ paddingLeft: `${(depth + 1) * 16}px` }}>
                [*] (array items)
              </div>
              
              {Object.keys(schema.items.properties).map(key => {
                const childPath = `${path}[*].${key}`;
                return renderSchemaNode(schema.items.properties[key], childPath, key, depth + 2);
              })}
            </div>
          )}
        </div>
      );
    } else {
      // Simple property (string, number, etc.)
      return (
        <div 
          className="schema-node leaf" 
          key={path}
          style={{ paddingLeft: `${depth * 16}px` }}
        >
          <span 
            className={`node-label ${selectedField === path ? 'selected' : ''}`}
            onClick={() => onSelectField(path)}
          >
            {label}
          </span>
          <span className="node-type">{schema.type}</span>
        </div>
      );
    }
  };
  
  return (
    <div className="field-selector">
      <h4>Data Schema</h4>
      <div className="schema-tree">
        {renderSchemaNode(sampleSchema)}
      </div>
    </div>
  );
};

export default FieldSelector;