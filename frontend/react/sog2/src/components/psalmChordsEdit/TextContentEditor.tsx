import React, { useEffect, useRef } from 'react';

import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { TextContentEditingField } from './styled';

interface TextContentEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  onSubmit: () => void;
  fontSize: number;
}

const TextContentEditor = ({ value, onChange, fontSize, onSubmit }: TextContentEditorProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setEditingTextContentId } = useChordsEditInstrumentsContext();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
      setEditingTextContentId(null);
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <TextContentEditingField
      ref={inputRef}
      onKeyPress={handleKeyPress}
      fontSize={fontSize}
      value={value}
      onChange={({ target }) => onChange(target.value)}
    />
  );
};

export default TextContentEditor;
