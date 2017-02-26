import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

const Card = styled.div`
  flex: 0 0 auto;
  height: 200px;
  width: 200px;
  margin: 10px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${props => props.genre_url});
  border-radius: 5px;
  font-size: 30px;
`;

const StyledLink = styled(Link)`
  text-align: center;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

class GenreCard extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  render() {
    const { name, img_src } = this.props;
    return (
      <StyledLink to={`${name.toLowerCase()}`} title={name}>
        <Card genre_url={img_src} />
      </StyledLink>
    );
  }
}

export default GenreCard;
