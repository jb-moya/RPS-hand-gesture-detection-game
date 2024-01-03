import React, { useState, useEffect } from "react";

export const CursorPositionContext = React.createContext();

export const CursorPositionProvider = ({ children }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const roundOffX = Math.round(e.clientX / 2) * 2;
    const roundOffY = Math.round(e.clientY / 2) * 2;

    // divisibility for performance. Greater number = less frequent updates = better performance
    const divisibilityX = 3
    const divisibilityY = 2

    if (roundOffX % divisibilityX === 0 && roundOffY % divisibilityY === 0) {
      setCursorPosition({ x: roundOffX, y: roundOffY });
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    }
  }, [cursorPosition]);

  return (
    <CursorPositionContext.Provider value={{ cursorPosition: cursorPosition }}>
      {children}
    </CursorPositionContext.Provider>
  );
};