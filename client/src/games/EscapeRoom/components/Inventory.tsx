import React, { useState } from 'react';
import { ItemData, gameItems } from '../data/puzzles';

interface InventoryProps {
  items: string[];
  onItemUse: (itemId: string) => void;
  onItemCombine: (itemIds: string[]) => void;
  canCombine?: boolean;
}

export const Inventory: React.FC<InventoryProps> = ({
  items,
  onItemUse,
  onItemCombine,
  canCombine = true
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Get item details
  const getItemDetails = (itemId: string): ItemData | undefined => {
    return gameItems.find(item => item.id === itemId);
  };

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Get category icon
  const getCategoryIcon = (category: ItemData['category']): string => {
    const icons = {
      tool: '🔧',
      chemical: '⚗️',
      equipment: '🔬',
      key: '🔑',
      sample: '🧪',
      consumable: '💊'
    };
    return icons[category] || '📦';
  };

  // Get category color
  const getCategoryColor = (category: ItemData['category']): string => {
    const colors = {
      tool: '#FF9800',
      chemical: '#4CAF50',
      equipment: '#2196F3',
      key: '#FFC107',
      sample: '#9C27B0',
      consumable: '#00BCD4'
    };
    return colors[category] || '#607D8B';
  };

  // Handle combine
  const handleCombine = () => {
    if (selectedItems.length >= 2) {
      onItemCombine(selectedItems);
      setSelectedItems([]);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 100
    }}>
      {/* Collapsed View */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            border: '3px solid #4a90e2',
            borderRadius: '16px',
            padding: '16px 24px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
          }}
        >
          <span style={{ fontSize: '24px' }}>🎒</span>
          <div>
            <div>Inventory</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {items.length} items
            </div>
          </div>
        </button>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          width: '400px',
          maxHeight: '600px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          border: '3px solid #4a90e2',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            padding: '20px',
            borderBottom: '2px solid #4a90e2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>🎒</span>
              <div>
                <h3 style={{ margin: 0, color: 'white', fontSize: '20px' }}>
                  Inventory
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#aaa', fontSize: '12px' }}>
                  {items.length} items collected
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsExpanded(false);
                setSelectedItems([]);
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Combine Controls */}
          {canCombine && selectedItems.length > 0 && (
            <div style={{
              background: 'rgba(255, 193, 7, 0.1)',
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255, 193, 7, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: '#FFC107', fontSize: '14px' }}>
                {selectedItems.length} items selected
              </div>
              <button
                onClick={handleCombine}
                disabled={selectedItems.length < 2}
                style={{
                  background: selectedItems.length >= 2
                    ? 'linear-gradient(135deg, #FFC107, #FFB300)'
                    : '#555',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: selectedItems.length >= 2 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedItems.length >= 2) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🔧 Combine
              </button>
            </div>
          )}

          {/* Items Grid */}
          <div style={{
            padding: '20px',
            overflowY: 'auto',
            flex: 1
          }}>
            {items.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <div style={{ fontSize: '16px' }}>Your inventory is empty</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Collect items by interacting with objects in the rooms
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {items.map(itemId => {
                  const item = getItemDetails(itemId);
                  if (!item) return null;

                  const isSelected = selectedItems.includes(itemId);
                  const isHovered = hoveredItem === itemId;
                  const categoryColor = getCategoryColor(item.category);

                  return (
                    <div
                      key={itemId}
                      onClick={() => canCombine && toggleItemSelection(itemId)}
                      onMouseEnter={() => setHoveredItem(itemId)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${categoryColor}40, ${categoryColor}20)`
                          : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${isSelected ? categoryColor : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: canCombine ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        boxShadow: isHovered
                          ? `0 8px 24px ${categoryColor}40`
                          : '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      {/* Category Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: categoryColor,
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}>
                        {getCategoryIcon(item.category)}
                      </div>

                      {/* Item Icon */}
                      <div style={{
                        fontSize: '32px',
                        marginBottom: '8px',
                        textAlign: 'center'
                      }}>
                        {getCategoryIcon(item.category)}
                      </div>

                      {/* Item Name */}
                      <div style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                        textAlign: 'center'
                      }}>
                        {item.name}
                      </div>

                      {/* Item Description */}
                      <div style={{
                        color: '#aaa',
                        fontSize: '11px',
                        textAlign: 'center',
                        lineHeight: '1.3'
                      }}>
                        {item.description}
                      </div>

                      {/* Can Combine Indicator */}
                      {item.canCombine && (
                        <div style={{
                          marginTop: '8px',
                          textAlign: 'center',
                          color: '#FFC107',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          ⚡ COMBINABLE
                        </div>
                      )}

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '-8px',
                          background: categoryColor,
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          border: '2px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Info */}
          {items.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '12px 20px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '12px',
              color: '#888',
              textAlign: 'center'
            }}>
              💡 {canCombine
                ? 'Click items to select, then combine them to create new items'
                : 'Collect and use items to solve puzzles'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;
