import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Add onClick prop to allow the card to be clickable.
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`bg-white border border-gray-200 rounded-xl shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
