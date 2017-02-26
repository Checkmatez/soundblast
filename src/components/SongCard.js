import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import { formatSongTitle } from '../utils/FormatUtils';

const propTypes = {
  song: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  playSong: PropTypes.func.isRequired,
};

const Container = styled.section`
  flex: 0 1 auto;
  width: 214px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #e3e3e3;
  background-color: #fff;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 70px;
  margin-bottom: 10px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${props => props.artwork_url});
`;

const PlayIconDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s ease-in-out;
  background-color: ${p => p.isActive ? 'rgba(0, 0, 0, 0.8)' : 'transparent'};

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.8);
  }

  &:hover i {
    opacity: 1;
  }
`;

const Icon = styled.i`
  font-size: 26px;
  color: #A6D2A5;
  opacity: ${p => p.visible ? '1' : '0'};
  transition: opacity 0.2s ease-in-out;
`;

const SongCardUser = styled.footer`
  display: block;
  width: 100%;
`;

const UserAvatar = styled.img`
  display: block;
  float: left;
  width: 1.5em;
  height: 1.5em;
  border-radius: 100%;
  margin-right: 10px;
  margin-top: 2px;
`;

const DivRelative = styled.div`
  position: relative;
`;

const linkStyles = () => `
  display: block;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const StyledSongLink = styled(Link)`
  ${linkStyles}
  color: #3381b7;
`;

const StyledUserLink = styled(Link)`
  ${linkStyles}
  color: #d00303;
  margin-top: 5px;
`;

const Heart = styled.i`
  position: absolute;
  bottom: 0px;
  right: 0px;
  color: #ccc;
  font-size: 14px;

  &:hover {
    cursor: pointer;
    color: #F9C5C5;
  }
`;

const SongCard = ({ song, user, isActive, isPlaying, playSong }) => (
  <Container>
    <ImageContainer
      artwork_url={
        song.artwork_url && song.artwork_url.replace('large', 't300x300')
      }
    >
      <PlayIconDiv onClick={playSong} isActive={isActive}>
        <Icon
          className={isActive && isPlaying ? 'fa fa-music' : 'fa fa-play'}
          visible={isActive}
        />
      </PlayIconDiv>
    </ImageContainer>
    <SongCardUser>
      <UserAvatar src={`${user.avatar_url}`} alt="user avatar" />
      <DivRelative>
        <StyledSongLink to={`songs/${song.id}`} title={song.title}>
          {formatSongTitle(song.title)}
        </StyledSongLink>
        <StyledUserLink to={`users/${user.id}`} title={user.username}>
          {user.username}
        </StyledUserLink>
        <Heart className="fa fa-heart" />
      </DivRelative>
    </SongCardUser>
  </Container>
);
SongCard.propTypes = propTypes;

export default SongCard;
