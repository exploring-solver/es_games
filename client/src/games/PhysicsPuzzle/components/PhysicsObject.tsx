import React from 'react';
import { PhysicsObject as PhysicsObjectType } from '../data/puzzles';

interface PhysicsObjectInfoProps {
  object: PhysicsObjectType;
  onClick?: () => void;
  isSelected?: boolean;
  count?: number;
}

export const PhysicsObjectInfo: React.FC<PhysicsObjectInfoProps> = ({
  object,
  onClick,
  isSelected,
  count,
}) => {
  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'ball':
        return '⚫';
      case 'box':
        return '▪';
      case 'platform':
        return '▬';
      case 'ramp':
        return '◢';
      case 'pendulum':
        return '⟳';
      case 'spring':
        return '⚌';
      case 'domino':
        return '▮';
      case 'lever':
        return '⚖';
      case 'wheel':
        return '◯';
      default:
        return '■';
    }
  };

  const getObjectName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? 'rgba(100, 200, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
        padding: '10px',
        borderRadius: '8px',
        border: isSelected
          ? `2px solid ${object.color}`
          : '1px solid rgba(255, 255, 255, 0.1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.background = 'rgba(100, 200, 255, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick && !isSelected) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }
      }}
    >
      {/* Count badge */}
      {count !== undefined && count > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: object.color,
            color: '#000',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            border: '2px solid #0f0f1a',
          }}
        >
          {count}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Icon */}
        <div
          style={{
            fontSize: '24px',
            color: object.color,
          }}
        >
          {getObjectIcon(object.type)}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '2px' }}>
            {getObjectName(object.type)}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.5)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <span>m: {object.mass.toFixed(1)}</span>
            <span>μ: {object.friction.toFixed(2)}</span>
            <span>e: {object.restitution.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ObjectPaletteProps {
  availableObjects: {
    type: PhysicsObjectType['type'];
    count: number;
    properties: Partial<PhysicsObjectType>;
  }[];
  selectedType: PhysicsObjectType['type'] | null;
  onSelectType: (type: PhysicsObjectType['type']) => void;
  usedCounts: Record<string, number>;
}

export const ObjectPalette: React.FC<ObjectPaletteProps> = ({
  availableObjects,
  selectedType,
  onSelectType,
  usedCounts,
}) => {
  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid rgba(100, 200, 255, 0.3)',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', color: '#64b5f6', fontSize: '16px' }}>
        Available Objects
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {availableObjects.map((avail, index) => {
          const used = usedCounts[avail.type] || 0;
          const remaining = avail.count - used;
          const canUse = remaining > 0;

          const sampleObject: PhysicsObjectType = {
            id: `sample-${avail.type}`,
            type: avail.type,
            x: 0,
            y: 0,
            color: (avail.properties.color as string) || '#ffffff',
            mass: avail.properties.mass || 1,
            friction: avail.properties.friction || 0.5,
            restitution: avail.properties.restitution || 0.5,
            isStatic: avail.properties.isStatic || false,
            width: avail.properties.width,
            height: avail.properties.height,
            radius: avail.properties.radius,
          };

          return (
            <div key={index} style={{ position: 'relative' }}>
              <PhysicsObjectInfo
                object={sampleObject}
                onClick={canUse ? () => onSelectType(avail.type) : undefined}
                isSelected={selectedType === avail.type}
                count={remaining}
              />

              {!canUse && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#ef4444',
                    fontWeight: 'bold',
                  }}
                >
                  All Used
                </div>
              )}
            </div>
          );
        })}
      </div>

      {availableObjects.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '13px',
          }}
        >
          No objects available
        </div>
      )}
    </div>
  );
};
