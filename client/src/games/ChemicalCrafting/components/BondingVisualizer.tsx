import React from 'react';
import { Atom, Bond } from '../data/compounds';
import { ELEMENTS } from '../data/elements';
import { calculateElectronConfig } from '../utils/chemistryEngine';

interface BondingVisualizerProps {
  atoms: Atom[];
  bonds: Bond[];
  selectedAtomIndex?: number | null;
}

export const BondingVisualizer: React.FC<BondingVisualizerProps> = ({
  atoms,
  bonds,
  selectedAtomIndex = null,
}) => {
  if (atoms.length === 0) {
    return (
      <div style={{
        padding: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        color: '#999',
        textAlign: 'center',
      }}>
        No atoms to visualize. Add atoms to see electron configurations.
      </div>
    );
  }

  const displayIndex = selectedAtomIndex !== null && selectedAtomIndex >= 0 ? selectedAtomIndex : 0;
  const atom = atoms[displayIndex];

  if (!atom) {
    return null;
  }

  const element = ELEMENTS[atom.element];
  if (!element) {
    return null;
  }

  const electronConfig = calculateElectronConfig(atom.element, bonds, displayIndex);

  // Calculate bond information for this atom
  const atomBonds = bonds.filter(b => b.atom1 === displayIndex || b.atom2 === displayIndex);
  const bondCount = atomBonds.length;
  const bondTypes = atomBonds.map(b => b.type);

  // Draw electron shell diagram
  const drawElectronShells = () => {
    const shells = [];
    const maxElectrons = element.period === 1 ? 2 : 8;
    const totalElectrons = element.valenceElectrons;

    // Calculate electrons in outer shell
    const outerElectrons = totalElectrons;

    return (
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Nucleus */}
        <circle
          cx="100"
          cy="100"
          r="20"
          fill={element.color}
          stroke="#666"
          strokeWidth="2"
        />
        <text
          x="100"
          y="105"
          textAnchor="middle"
          fill="#fff"
          fontSize="16"
          fontWeight="bold"
        >
          {element.symbol}
        </text>

        {/* Valence shell */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#4ECDC4"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Draw valence electrons */}
        {Array.from({ length: outerElectrons }).map((_, i) => {
          const angle = (i / maxElectrons) * Math.PI * 2 - Math.PI / 2;
          const x = 100 + Math.cos(angle) * 70;
          const y = 100 + Math.sin(angle) * 70;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill="#FFD700"
              stroke="#666"
              strokeWidth="1"
            />
          );
        })}

        {/* Draw bonded electrons */}
        {atomBonds.map((bond, i) => {
          const bondedElectrons = bond.type === 'single' ? 2 : bond.type === 'double' ? 4 : 6;
          const startAngle = Math.PI * 2 * (i / atomBonds.length);

          return Array.from({ length: bondedElectrons }).map((_, j) => {
            const angle = startAngle + (j / bondedElectrons) * (Math.PI * 2 / atomBonds.length);
            const x = 100 + Math.cos(angle) * 85;
            const y = 100 + Math.sin(angle) * 85;

            return (
              <circle
                key={`bonded-${i}-${j}`}
                cx={x}
                cy={y}
                r="4"
                fill="#FF6B6B"
                stroke="#666"
                strokeWidth="1"
              />
            );
          });
        })}

        {/* Octet completion indicator */}
        {electronConfig.octetSatisfied && (
          <text
            x="100"
            y="180"
            textAnchor="middle"
            fill="#4ECDC4"
            fontSize="12"
            fontWeight="bold"
          >
            Octet Satisfied
          </text>
        )}
      </svg>
    );
  };

  return (
    <div style={{
      padding: 20,
      backgroundColor: '#1a1a1a',
      borderRadius: 8,
      color: '#fff',
    }}>
      <h3 style={{ marginBottom: 15, color: '#FFD700' }}>
        Electron Configuration
      </h3>

      {/* Atom selector */}
      {atoms.length > 1 && (
        <div style={{
          marginBottom: 15,
          display: 'flex',
          gap: 5,
          flexWrap: 'wrap',
        }}>
          {atoms.map((a, i) => (
            <div
              key={i}
              style={{
                padding: '5px 10px',
                backgroundColor: i === displayIndex ? '#4ECDC4' : '#2a2a2a',
                color: i === displayIndex ? '#000' : '#fff',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 'bold',
                cursor: 'pointer',
                border: `2px solid ${i === displayIndex ? '#4ECDC4' : '#444'}`,
              }}
            >
              {a.element}{i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Electron shell diagram */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        {drawElectronShells()}
      </div>

      {/* Element information */}
      <div style={{
        padding: 15,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 15,
      }}>
        <h4 style={{ margin: 0, marginBottom: 10, color: element.color }}>
          {element.name} ({element.symbol})
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          fontSize: 13,
        }}>
          <div>
            <strong>Atomic Number:</strong> {element.atomicNumber}
          </div>
          <div>
            <strong>Atomic Mass:</strong> {element.atomicMass.toFixed(3)}
          </div>
          <div>
            <strong>Valence e⁻:</strong> {element.valenceElectrons}
          </div>
          <div>
            <strong>Electronegativity:</strong> {element.electronegativity.toFixed(2)}
          </div>
          <div>
            <strong>Max Bonds:</strong> {element.maxBonds}
          </div>
          <div>
            <strong>Current Bonds:</strong> {bondCount}
          </div>
        </div>
      </div>

      {/* Electron configuration details */}
      <div style={{
        padding: 15,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 15,
      }}>
        <h4 style={{ margin: 0, marginBottom: 10, color: '#4ECDC4' }}>
          Bonding Details
        </h4>
        <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid #444',
          }}>
            <span>Valence Electrons:</span>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
              {electronConfig.valenceElectrons}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid #444',
          }}>
            <span>Bonded Electrons:</span>
            <span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
              {electronConfig.bondedElectrons}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid #444',
          }}>
            <span>Available Electrons:</span>
            <span style={{ color: '#95E1D3', fontWeight: 'bold' }}>
              {electronConfig.availableElectrons}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
          }}>
            <span>Octet Rule:</span>
            <span style={{
              color: electronConfig.octetSatisfied ? '#4ECDC4' : '#FF6B6B',
              fontWeight: 'bold',
            }}>
              {electronConfig.octetSatisfied ? 'Satisfied' : 'Not Satisfied'}
            </span>
          </div>
        </div>
      </div>

      {/* Bond information */}
      {bondCount > 0 && (
        <div style={{
          padding: 15,
          backgroundColor: '#2a2a2a',
          borderRadius: 8,
        }}>
          <h4 style={{ margin: 0, marginBottom: 10, color: '#4ECDC4' }}>
            Bonds ({bondCount})
          </h4>
          <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {atomBonds.map((bond, i) => {
              const otherIndex = bond.atom1 === displayIndex ? bond.atom2 : bond.atom1;
              const otherAtom = atoms[otherIndex];
              const otherElement = otherAtom ? ELEMENTS[otherAtom.element] : null;

              return (
                <div
                  key={i}
                  style={{
                    padding: 10,
                    backgroundColor: '#1a1a1a',
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ color: element.color, fontWeight: 'bold' }}>
                      {element.symbol}
                    </span>
                    <span style={{ color: '#999', margin: '0 5px' }}>
                      {bond.type === 'single' ? '─' : bond.type === 'double' ? '═' : '≡'}
                    </span>
                    <span style={{ color: otherElement?.color || '#fff', fontWeight: 'bold' }}>
                      {otherElement?.symbol || '?'}
                    </span>
                  </div>
                  <div style={{ color: '#999', fontSize: 11 }}>
                    {bond.strength} kJ/mol
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lewis dot structure */}
      <div style={{
        marginTop: 15,
        padding: 15,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
      }}>
        <h4 style={{ margin: 0, marginBottom: 10, color: '#4ECDC4' }}>
          Lewis Dot Structure
        </h4>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          fontSize: 20,
          fontFamily: 'monospace',
        }}>
          {renderLewisDot(element, bondCount)}
        </div>
      </div>
    </div>
  );
};

function renderLewisDot(element: { symbol: string; valenceElectrons: number }, bondCount: number) {
  const unbondedElectrons = Math.max(0, element.valenceElectrons - bondCount * 2);
  const dots = Array.from({ length: unbondedElectrons }).map((_, i) => (
    <span key={i} style={{ color: '#FFD700', margin: '0 2px' }}>•</span>
  ));

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', padding: '0 10px' }}>
        {element.symbol}
      </span>
      <div style={{
        position: 'absolute',
        top: -10,
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {dots.slice(0, Math.floor(unbondedElectrons / 4))}
      </div>
      <div style={{
        position: 'absolute',
        bottom: -10,
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {dots.slice(Math.floor(unbondedElectrons / 4), Math.floor(unbondedElectrons / 2))}
      </div>
      <div style={{
        position: 'absolute',
        left: -15,
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        {dots.slice(Math.floor(unbondedElectrons / 2), Math.floor(unbondedElectrons * 3 / 4))}
      </div>
      <div style={{
        position: 'absolute',
        right: -15,
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        {dots.slice(Math.floor(unbondedElectrons * 3 / 4))}
      </div>
    </div>
  );
}
