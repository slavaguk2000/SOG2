import React from 'react';

import { Typography, TypographyProps } from '@mui/material';

import { Psalm } from '../../../utils/gql/types';

import { PsalmTitleWrapper } from './styled';

interface PsalmTitleProps {
  fontSize?: number;
  psalm: Psalm;
  typographyProps?: TypographyProps;
}

const PsalmTitle = ({ fontSize, psalm, typographyProps }: PsalmTitleProps) => {
  return (
    <PsalmTitleWrapper>
      <Typography
        fontWeight="bold"
        fontSize={fontSize}
        {...typographyProps}
      >{`${psalm.psalmNumber} ${psalm.name}`}</Typography>
    </PsalmTitleWrapper>
  );
};

export default PsalmTitle;
