import React, { useMemo } from 'react';

import { CuttableTextChar } from './styled';

interface CuttableTextProps {
  text: string;
  onCharClick: (charPosition: number) => void;
}

const CuttableText = ({ text, onCharClick }: CuttableTextProps) => {
  const chars = useMemo(() => text.split(''), [text]);

  if (!text.length) {
    return null;
  }

  const [firstChar, ...restChars] = chars;

  return (
    <span>
      <span>{firstChar}</span>
      {restChars.map((char, idx) => (
        <CuttableTextChar onClick={() => onCharClick(idx + 1)} key={idx}>
          <span>{char}</span>
        </CuttableTextChar>
      ))}
    </span>
  );
};

export default CuttableText;
