import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="bg-blue-500 px-4 py-2 rounded text-white transition-all duration-300 hover:translate-y-1"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
