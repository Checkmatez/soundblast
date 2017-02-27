import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import SongCard from './SongCard';
import { playSong } from '../actions/PlayerActions';
import { fetchSongsIfNeeded } from '../actions/PlaylistsActions';
import { getSongsInPlaylist, getUsers, getCurrentSong } from '../reducers';

const DivContainer = styled.div`
  background-color: #f4f4f4;
  padding-bottom: 43px;
`;

const FlexContainer = styled.ul`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
  max-width: 1170px;
  margin: 0 auto;
`;

class SongList extends Component {
  static propTypes = {
    playlistName: PropTypes.string.isRequired,
    songsInPlaylist: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
    currentSongId: PropTypes.number,
    isPlaying: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { playlistName, dispatch } = this.props;
    dispatch(fetchSongsIfNeeded(playlistName));
  }

  playSong(songId, e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(playSong(songId));
  }

  render() {
    const { songsInPlaylist, users, currentSongId, isPlaying } = this.props;

    return (
      <DivContainer>
        <FlexContainer>
          {songsInPlaylist.map(song => (
            <SongCard
              key={song.id}
              song={song}
              user={users[song.user]}
              isActive={song.id === currentSongId}
              isPlaying={isPlaying}
              playSong={this.playSong.bind(this, song.id)}
            />
          ))}
        </FlexContainer>
      </DivContainer>
    );
  }
}

const mapStateToProps = (state, { params }) => ({
  playlistName: params.categories,
  songsInPlaylist: getSongsInPlaylist(state, params.categories),
  users: getUsers(state),
  currentSongId: getCurrentSong(state).id,
  isPlaying: state.player.isPlaying
});

export default connect(mapStateToProps)(SongList);
