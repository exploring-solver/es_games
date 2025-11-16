import React, { useState } from 'react';
import { Element, ELEMENT_CATEGORIES } from '../data/elements';

interface PeriodicTableProps {
  availableElements: Element[];
  selectedElement: string | null;
  onSelectElement: (symbol: string) => void;
  elementsUsed?: Record<string, number>;
  showAll?: boolean;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  availableElements,
  selectedElement,
  onSelectElement,
  elementsUsed = {},
  showAll = false,
}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const isAvailable = (symbol: string) => {
    return showAll || availableElements.some(e => e.symbol === symbol);
  };

  const getElement = (symbol: string) => {
    return availableElements.find(e => e.symbol === symbol);
  };

  const renderElement = (element: Element | undefined, symbol: string) => {
    if (!element && !showAll) {
      return (
        <div
          key={symbol}
          className="periodic-element empty"
          style={{
            width: 50,
            height: 50,
            margin: 2,
            border: '1px solid #333',
            borderRadius: 4,
            backgroundColor: '#1a1a1a',
          }}
        />
      );
    }

    if (!element) return null;

    const available = isAvailable(symbol);
    const used = elementsUsed[symbol] || 0;
    const isSelected = selectedElement === symbol;
    const isHovered = hoveredElement === symbol;
    const category = ELEMENT_CATEGORIES[element.category];

    return (
      <div
        key={symbol}
        className={`periodic-element ${available ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
        onClick={() => available && onSelectElement(symbol)}
        onMouseEnter={() => setHoveredElement(symbol)}
        onMouseLeave={() => setHoveredElement(null)}
        style={{
          width: 50,
          height: 50,
          margin: 2,
          border: `2px solid ${isSelected ? '#FFD700' : isHovered ? element.color : '#444'}`,
          borderRadius: 4,
          backgroundColor: available ? category.color : '#2a2a2a',
          opacity: available ? 1 : 0.3,
          cursor: available ? 'pointer' : 'not-allowed',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.2s ease',
          transform: isHovered && available ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isSelected ? '0 0 15px rgba(255, 215, 0, 0.5)' : 'none',
        }}
      >
        <div style={{
          fontSize: 10,
          fontWeight: 'bold',
          color: '#666',
        }}>
          {element.atomicNumber}
        </div>
        <div style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: available ? '#fff' : '#666',
        }}>
          {element.symbol}
        </div>
        <div style={{
          fontSize: 8,
          color: '#999',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}>
          {element.name}
        </div>
        {used > 0 && (
          <div style={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: '#FF6B6B',
            color: '#fff',
            borderRadius: '50%',
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 'bold',
          }}>
            {used}
          </div>
        )}
      </div>
    );
  };

  const hoveredElementData = hoveredElement ? getElement(hoveredElement) : null;

  return (
    <div style={{
      padding: 20,
      backgroundColor: '#1a1a1a',
      borderRadius: 8,
      color: '#fff',
    }}>
      <h3 style={{ marginBottom: 15, textAlign: 'center', color: '#FFD700' }}>
        Available Elements
      </h3>

      {/* Simplified periodic table layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(54px, 1fr))',
        gap: 4,
        maxWidth: 600,
        margin: '0 auto',
      }}>
        {availableElements.map(element => renderElement(element, element.symbol))}
      </div>

      {/* Element details on hover */}
      {hoveredElementData && (
        <div style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#2a2a2a',
          borderRadius: 8,
          border: `2px solid ${hoveredElementData.color}`,
        }}>
          <h4 style={{ margin: 0, marginBottom: 10, color: hoveredElementData.color }}>
            {hoveredElementData.name} ({hoveredElementData.symbol})
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            fontSize: 12,
          }}>
            <div>
              <strong>Atomic Number:</strong> {hoveredElementData.atomicNumber}
            </div>
            <div>
              <strong>Atomic Mass:</strong> {hoveredElementData.atomicMass.toFixed(3)}
            </div>
            <div>
              <strong>Valence Electrons:</strong> {hoveredElementData.valenceElectrons}
            </div>
            <div>
              <strong>Max Bonds:</strong> {hoveredElementData.maxBonds}
            </div>
            <div>
              <strong>Electronegativity:</strong> {hoveredElementData.electronegativity.toFixed(2)}
            </div>
            <div>
              <strong>State:</strong> {hoveredElementData.state}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Category:</strong> {ELEMENT_CATEGORIES[hoveredElementData.category].name}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
      }}>
        <div style={{ fontSize: 12, marginBottom: 8, fontWeight: 'bold' }}>Legend:</div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: 11,
        }}>
          {Object.entries(ELEMENT_CATEGORIES).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 15,
                height: 15,
                backgroundColor: value.color,
                borderRadius: 2,
                border: '1px solid #666',
              }} />
              <span>{value.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: 15,
        padding: 10,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        fontSize: 12,
        textAlign: 'center',
        color: '#999',
      }}>
        Click on an element to select it for building your molecule
      </div>
    </div>
  );
};
