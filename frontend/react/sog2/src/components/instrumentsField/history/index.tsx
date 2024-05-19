import React, { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import HistoryIcon from '@mui/icons-material/History';
import { CircularProgress, IconButton, MenuItem, MenuList, Popover, Tooltip, Typography } from '@mui/material';

import { useBibleData } from '../../../providers/dataProviders/bibleDataProvider';
import { bibleHistory } from '../../../utils/gql/queries';
import { Query, QueryBibleHistoryArgs, Slide } from '../../../utils/gql/types';

import { EllipsisTypography, HistoryContentWrapper, HistoryInstrumentIconWrapper } from './styled';

const History = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setAnchorEl(null);
    } else if (event.key === 'Escape') {
      setAnchorEl(null);
    }
  };

  const open = Boolean(anchorEl);

  const { data, loading } = useQuery<Pick<Query, 'bibleHistory'>, QueryBibleHistoryArgs>(bibleHistory, {
    variables: {
      bibleId: '0',
      start: 0,
      size: 30,
    },
    fetchPolicy: 'no-cache',
    skip: !open,
  });

  const { getReadableBiblePlace, handleUpdateSlide } = useBibleData();

  const historyData = useMemo(
    () =>
      data?.bibleHistory.map((slide) => ({
        slide,
        title: `${getReadableBiblePlace(slide, true)} ${slide.content}`,
      })),
    [data?.bibleHistory, getReadableBiblePlace],
  );

  const handleSlideClick = (slide: Slide) => {
    handleUpdateSlide(slide);
    handleClose();
  };

  return (
    <HistoryInstrumentIconWrapper>
      <Tooltip title="History">
        <IconButton onClick={handleClick}>
          <HistoryIcon />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <HistoryContentWrapper>
          <MenuList
            autoFocusItem={open}
            id="composition-menu"
            aria-labelledby="composition-button"
            onKeyDown={handleListKeyDown}
          >
            {loading || !historyData ? (
              <CircularProgress />
            ) : (
              historyData.map(({ slide, title }, idx) => (
                <MenuItem key={slide.location?.join('-') ?? idx} onClick={() => handleSlideClick(slide)}>
                  <Tooltip title={<Typography>{slide.content}</Typography>} placement="bottom-end">
                    <EllipsisTypography>{title}</EllipsisTypography>
                  </Tooltip>
                </MenuItem>
              ))
            )}
          </MenuList>
        </HistoryContentWrapper>
      </Popover>
    </HistoryInstrumentIconWrapper>
  );
};

export default History;
