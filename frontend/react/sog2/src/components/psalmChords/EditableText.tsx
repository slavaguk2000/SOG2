import React, { useRef, useState } from 'react';

import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { ClickableSpan, TextContentEditingField } from './styled';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  fontSize?: number;
  isEditing?: boolean;
  requestEdit?: () => void;
  requestEditFinish?: () => void;
}

const EditableText = ({ value, onChange, fontSize, isEditing, requestEdit, requestEditFinish }: EditableTextProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isTextEditing } = useChordsEditInstrumentsContext();
  const [internalValue, setInternalValue] = useState<string | null>(null);
  const [inputWidth, setInputWidth] = useState<number>(200);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (isTextEditing) {
      setInternalValue(value);
      setInputWidth((e.target as unknown as { offsetWidth: number }).offsetWidth);
      requestEdit?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setInternalValue((prev) => {
        if (prev !== null) {
          onChange(prev);
        }
        requestEditFinish?.();
        return null;
      });
      e.preventDefault();
    }
  };

  return (isEditing === undefined ? internalValue === null : !isEditing) ? (
    <ClickableSpan clickable={isTextEditing} onClick={handleClick}>
      {value}
    </ClickableSpan>
  ) : (
    <TextContentEditingField
      width={inputWidth}
      ref={inputRef}
      onKeyPress={handleKeyPress}
      fontSize={fontSize}
      value={internalValue ?? value}
      onChange={({ target }) => setInternalValue(target.value)}
    />
  );
};

export default EditableText;
