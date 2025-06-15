import type React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
  titleClassName = "",
}) => {
  return (
    <div
      className={`bg-secondary rounded-lg border border-gray-700 p-6 shadow-lg ${className}`}
    >
      {title && (
        <h3
          className={`text-lg font-semibold text-accent mb-4 ${titleClassName}`}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
