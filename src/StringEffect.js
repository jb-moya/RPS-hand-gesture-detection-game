import React, { useContext, useEffect, useRef } from "react";
import { CursorPositionContext } from "./CursorPositionDetection";

const StringEffect = ({ text, className }) => {
  const { cursorPosition } = useContext(CursorPositionContext);
  const textRef = useRef(null);

  useEffect(() => {
    const textElement = textRef.current;

    const boundingBox = textElement.getBoundingClientRect();

    const centerX = boundingBox.left + boundingBox.width / 2;
    const centerY = boundingBox.top + boundingBox.height / 2;

    const offSetX = (cursorPosition.x - centerX) / 150;
    const offSetY = (cursorPosition.y - centerY) / 150;

    textElement.style.textShadow = `
      ${offSetX * -1}px ${offSetY * -1}px 0px rgb(150, 150, 150)`;

    return () => {
      textElement.style.textShadow = "";
    }
  }, [cursorPosition]);

  return <div ref={textRef} className={`${className}`}>{text}</div>
}

export default StringEffect;  