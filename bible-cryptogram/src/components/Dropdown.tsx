import React, { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface DropdownItem {
  type: 'button' | 'link';
  content: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  trigger, 
  items, 
  align = 'right', 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={className}>
      <div onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`menu-dropdown ${align === 'left' ? 'dropdown-left' : 'dropdown-right'}`}>
          {items.map((item, index) => {
            if (item.type === 'link' && item.href) {
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`menu-item ${item.className || ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.content}
                </a>
              );
            } else {
              return (
                <button
                  key={index}
                  className={`menu-item ${item.className || ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.content}
                </button>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown; 