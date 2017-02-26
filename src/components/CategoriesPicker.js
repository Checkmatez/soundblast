import React from 'react';
import styled from 'styled-components';

import GenreCard from './GenreCard';
import { GENRES } from '../constants/SongConstants';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  height: calc(100vh - 50px);
  padding-bottom: 43px;
  background-color: #f4f4f4;
`;

const Flex = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  max-width: 800px;
  margin: 0 auto;
`;

const CategoriesPicker = () => (
  <Wrapper>
    <Flex>
      {GENRES.map(genre => (
        <GenreCard
          name={genre.title}
          key={genre.img_src}
          img_src={genre.img_src}
        />
      ))}
    </Flex>
  </Wrapper>
);

export default CategoriesPicker;
