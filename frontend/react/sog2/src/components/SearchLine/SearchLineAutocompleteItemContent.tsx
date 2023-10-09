import React, { useMemo } from 'react';

import {
  SearchLineAutocompleteItemContentPlaceWrapper,
  SearchLineAutocompleteItemContentTextWrapper,
  SearchLineAutocompleteItemContentWrapper,
} from './styled';

interface SearchLineAutocompleteItemContentProps {
  onPlaceClick: () => void;
  searchContent: string;
  onPlaceHover: () => void;
  onPlaceBlur: () => void;
  placeSelected: boolean;
}

// 1 <span class="highlighted">Паралипоменон</span> <span class="highlighted">1</span>:<span class="highlighted">39</span> Сыновья Лотана: Хори и <span class="highlighted">Гемам</span>; а сестра у Лотана: Фимна.
// Бытие 29:34 От сего наречено ему имя: <span class="highlighted">Левий</span>.
const getPlaceFromSearchItemRegex =
  /(^.+(<span class="highlighted">)?\d+(<\/span>)?)(:(<span class="highlighted">)?\d+(<\/span>)?.+$)/;

const SearchLineAutocompleteItemContent = ({
  searchContent,
  onPlaceClick,
  placeSelected,
  onPlaceHover,
  onPlaceBlur,
}: SearchLineAutocompleteItemContentProps) => {
  const [place, content] = useMemo(() => {
    const placeFromSearchItemRegexRes = getPlaceFromSearchItemRegex.exec(searchContent);

    if (!placeFromSearchItemRegexRes || placeFromSearchItemRegexRes.length < 7) {
      return ['', searchContent];
    }

    return [placeFromSearchItemRegexRes[1] ?? '', placeFromSearchItemRegexRes[4]];
  }, [searchContent]);

  const handlePlaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaceClick();
  };

  return (
    <SearchLineAutocompleteItemContentWrapper>
      <SearchLineAutocompleteItemContentPlaceWrapper
        onClick={handlePlaceClick}
        dangerouslySetInnerHTML={{ __html: place }}
        selected={placeSelected}
        onMouseEnter={onPlaceHover}
        onMouseLeave={onPlaceBlur}
      />
      <SearchLineAutocompleteItemContentTextWrapper dangerouslySetInnerHTML={{ __html: content }} />
    </SearchLineAutocompleteItemContentWrapper>
  );
};

export default SearchLineAutocompleteItemContent;
