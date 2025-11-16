import React, { useRef, useEffect, useState } from 'react';
import { Atom, Bond } from '../data/compounds';
import { ELEMENTS } from '../data/elements';
import { useBonding } from '../hooks/useBonding';

interface MoleculeBuilderProps {
  atoms: Atom[];
  bonds: Bond[];
  onAddAtom: (element: string, position: { x: number; y: number; z: number }) => void;
  onRemoveAtom: (index: number) => void;
  onAddBond: (atom1: number, atom2: number, type: 'single' | 'double' | 'triple') => void;
  onRemoveBond: (index: number) => void;
  selectedElement: string | null;
  readonly?: boolean;
}

export const MoleculeBuilder: React.FC<MoleculeBuilderProps> = ({
  atoms,
  bonds,
  onAddAtom,
  onRemoveAtom,
  onAddBond,
  onRemoveBond,
  selectedElement,
  readonly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const { state: bondingState, actions: bondingActions, getBondVisualization } = useBonding(atoms, bonds);

  // Draw molecule on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up coordinate system
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    // Draw bonds first
    bonds.forEach((bond, index) => {
      const atom1 = atoms[bond.atom1];
      const atom2 = atoms[bond.atom2];

      if (!atom1 || !atom2) return;

      const viz = getBondVisualization(bond);

      // Apply rotation
      const pos1 = rotatePoint(atom1.position, rotation);
      const pos2 = rotatePoint(atom2.position, rotation);

      // Convert to screen coordinates
      const x1 = pos1.x * 50;
      const y1 = pos1.y * 50;
      const x2 = pos2.x * 50;
      const y2 = pos2.y * 50;

      ctx.strokeStyle = viz.color;
      ctx.lineWidth = viz.width;

      if (viz.style === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      // Draw based on bond type
      if (bond.type === 'single') {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (bond.type === 'double') {
        // Draw two parallel lines
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offsetX = (-dy / len) * 3;
        const offsetY = (dx / len) * 3;

        ctx.beginPath();
        ctx.moveTo(x1 + offsetX, y1 + offsetY);
        ctx.lineTo(x2 + offsetX, y2 + offsetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1 - offsetX, y1 - offsetY);
        ctx.lineTo(x2 - offsetX, y2 - offsetY);
        ctx.stroke();
      } else if (bond.type === 'triple') {
        // Draw three parallel lines
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offsetX = (-dy / len) * 5;
        const offsetY = (dx / len) * 5;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1 + offsetX, y1 + offsetY);
        ctx.lineTo(x2 + offsetX, y2 + offsetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1 - offsetX, y1 - offsetY);
        ctx.lineTo(x2 - offsetX, y2 - offsetY);
        ctx.stroke();
      }

      // Add glow effect for strong bonds
      if (viz.animation === 'glow') {
        ctx.shadowBlur = 10;
        ctx.shadowColor = viz.color;
      } else {
        ctx.shadowBlur = 0;
      }
    });

    // Draw preview bond
    if (bondingState.previewBond && bondingState.hoveredAtom !== null) {
      const atom1 = atoms[bondingState.previewBond.atom1];
      const atom2 = atoms[bondingState.previewBond.atom2];

      if (atom1 && atom2) {
        const pos1 = rotatePoint(atom1.position, rotation);
        const pos2 = rotatePoint(atom2.position, rotation);

        const x1 = pos1.x * 50;
        const y1 = pos1.y * 50;
        const x2 = pos2.x * 50;
        const y2 = pos2.y * 50;

        ctx.strokeStyle = bondingState.previewBond.valid ? '#4ECDC4' : '#FF6B6B';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.setLineDash([]);
      }
    }

    // Draw atoms
    atoms.forEach((atom, index) => {
      const element = ELEMENTS[atom.element];
      if (!element) return;

      const pos = rotatePoint(atom.position, rotation);
      const x = pos.x * 50;
      const y = pos.y * 50;

      // Calculate atom radius based on atomic radius
      const radius = Math.min(30, Math.max(15, element.atomicRadius / 8));

      const isSelected = bondingState.selectedAtom === index;
      const isHovered = bondingState.hoveredAtom === index;

      // Draw atom circle
      ctx.fillStyle = element.color;
      ctx.strokeStyle = isSelected ? '#FFD700' : isHovered ? '#FFF' : '#333';
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Add glow effect for selected/hovered
      if (isSelected || isHovered) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = isSelected ? '#FFD700' : '#FFF';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw element symbol
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.symbol, x, y);

      // Draw charge if present
      if (atom.charge) {
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 10px Arial';
        const sign = atom.charge > 0 ? '+' : '';
        ctx.fillText(`${sign}${atom.charge}`, x + radius - 5, y - radius + 5);
      }
    });

    ctx.restore();
  }, [atoms, bonds, rotation, scale, bondingState, getBondVisualization]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / scale;
    const y = (e.clientY - rect.top - canvas.height / 2) / scale;

    // Check if clicked on an atom
    let clickedAtomIndex = -1;
    atoms.forEach((atom, index) => {
      const pos = rotatePoint(atom.position, rotation);
      const atomX = pos.x * 50;
      const atomY = pos.y * 50;

      const element = ELEMENTS[atom.element];
      if (!element) return;

      const radius = Math.min(30, Math.max(15, element.atomicRadius / 8));
      const dist = Math.sqrt((x - atomX) ** 2 + (y - atomY) ** 2);

      if (dist < radius) {
        clickedAtomIndex = index;
      }
    });

    if (clickedAtomIndex >= 0) {
      // Clicked on an atom
      bondingActions.selectAtom(clickedAtomIndex);

      // Try to create bond if we have a preview
      if (bondingState.previewBond) {
        const result = bondingActions.attemptBond();
        if (result && result.success && result.bond) {
          onAddBond(result.bond.atom1, result.bond.atom2, result.bond.type);
        }
      }
    } else if (selectedElement) {
      // Add new atom
      const pos3d = inverseRotatePoint({ x: x / 50, y: y / 50, z: 0 }, rotation);
      onAddAtom(selectedElement, pos3d);
    }
  };

  // Handle right click to delete
  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (readonly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / scale;
    const y = (e.clientY - rect.top - canvas.height / 2) / scale;

    // Check if clicked on an atom
    atoms.forEach((atom, index) => {
      const pos = rotatePoint(atom.position, rotation);
      const atomX = pos.x * 50;
      const atomY = pos.y * 50;

      const element = ELEMENTS[atom.element];
      if (!element) return;

      const radius = Math.min(30, Math.max(15, element.atomicRadius / 8));
      const dist = Math.sqrt((x - atomX) ** 2 + (y - atomY) ** 2);

      if (dist < radius) {
        onRemoveAtom(index);
      }
    });
  };

  // Handle mouse move for rotation
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / scale;
    const y = (e.clientY - rect.top - canvas.height / 2) / scale;

    // Update hovered atom
    let hoveredIndex: number | null = null;
    atoms.forEach((atom, index) => {
      const pos = rotatePoint(atom.position, rotation);
      const atomX = pos.x * 50;
      const atomY = pos.y * 50;

      const element = ELEMENTS[atom.element];
      if (!element) return;

      const radius = Math.min(30, Math.max(15, element.atomicRadius / 8));
      const dist = Math.sqrt((x - atomX) ** 2 + (y - atomY) ** 2);

      if (dist < radius) {
        hoveredIndex = index;
      }
    });

    bondingActions.hoverAtom(hoveredIndex);

    if (isDragging && e.buttons === 1) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01,
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: 10,
        padding: 10,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        alignItems: 'center',
      }}>
        <div style={{ color: '#fff', fontSize: 14 }}>Bond Type:</div>
        {(['single', 'double', 'triple'] as const).map(type => (
          <button
            key={type}
            onClick={() => bondingActions.setBondType(type)}
            style={{
              padding: '8px 16px',
              backgroundColor: bondingState.bondType === type ? '#4ECDC4' : '#444',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 'bold',
              transition: 'all 0.2s',
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ color: '#fff', fontSize: 12 }}>
          Atoms: {atoms.length} | Bonds: {bonds.length}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          border: '2px solid #444',
          borderRadius: 8,
          backgroundColor: '#0a0a0a',
          cursor: readonly ? 'default' : selectedElement ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
        }}
      />

      {/* Instructions */}
      {!readonly && (
        <div style={{
          padding: 10,
          backgroundColor: '#2a2a2a',
          borderRadius: 8,
          fontSize: 12,
          color: '#999',
        }}>
          <strong>Controls:</strong> Left-click to add atoms/bonds | Right-click to delete | Drag to rotate | Scroll to zoom
        </div>
      )}

      {/* Bond preview message */}
      {bondingState.previewBond && !bondingState.previewBond.valid && (
        <div style={{
          padding: 10,
          backgroundColor: '#FF6B6B',
          color: '#fff',
          borderRadius: 8,
          fontSize: 12,
          textAlign: 'center',
        }}>
          {bondingState.previewBond.reason}
        </div>
      )}
    </div>
  );
};

// Helper functions for 3D rotation
function rotatePoint(point: { x: number; y: number; z: number }, rotation: { x: number; y: number }) {
  // Rotate around Y axis
  let x = point.x * Math.cos(rotation.y) + point.z * Math.sin(rotation.y);
  let z = -point.x * Math.sin(rotation.y) + point.z * Math.cos(rotation.y);

  // Rotate around X axis
  const y = point.y * Math.cos(rotation.x) - z * Math.sin(rotation.x);
  z = point.y * Math.sin(rotation.x) + z * Math.cos(rotation.x);

  return { x, y, z };
}

function inverseRotatePoint(point: { x: number; y: number; z: number }, rotation: { x: number; y: number }) {
  // Inverse rotation around X axis
  let y = point.y * Math.cos(-rotation.x) - point.z * Math.sin(-rotation.x);
  let z = point.y * Math.sin(-rotation.x) + point.z * Math.cos(-rotation.x);

  // Inverse rotation around Y axis
  const x = point.x * Math.cos(-rotation.y) + z * Math.sin(-rotation.y);
  z = -point.x * Math.sin(-rotation.y) + z * Math.cos(-rotation.y);

  return { x, y, z };
}
