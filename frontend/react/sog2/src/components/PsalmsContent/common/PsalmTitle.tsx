import React from 'react';

import { Typography, TypographyProps } from '@mui/material';

import { Psalm } from '../../../utils/gql/types';
import { useEditableChordsData } from '../../psalmChords/editableChordsDataProvider';
import EditableText from '../../psalmChords/EditableText';
import { useChordsEditInstrumentsContext } from '../../psalmChords/instrumentsProvider';

import { PsalmTitleWrapper } from './styled';

interface PsalmTitleProps {
  fontSize?: number;
  psalm: Psalm;
  typographyProps?: TypographyProps;
}

const PsalmTitle = ({ fontSize, psalm, typographyProps }: PsalmTitleProps) => {
  const { setEditingTextTitleEdit, setEditingTextNumberEdit, editingTextData, clearEditingTextState } =
    useChordsEditInstrumentsContext();
  const { handleEditNumber, handleEditTitle } = useEditableChordsData();

  return (
    <PsalmTitleWrapper>
      <Typography fontWeight="bold" fontSize={fontSize} {...typographyProps}>
        <EditableText
          fontSize={fontSize}
          value={psalm.psalmNumber ?? ''}
          onChange={handleEditNumber}
          isEditing={!!editingTextData.number}
          requestEdit={setEditingTextNumberEdit}
          requestEditFinish={clearEditingTextState}
        />{' '}
        <EditableText
          fontSize={fontSize}
          value={psalm.name}
          onChange={handleEditTitle}
          isEditing={!!editingTextData.title}
          requestEdit={setEditingTextTitleEdit}
          requestEditFinish={clearEditingTextState}
        />
      </Typography>
    </PsalmTitleWrapper>
  );
};

export default PsalmTitle;
