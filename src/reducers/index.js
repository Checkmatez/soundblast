import { combineReducers } from 'redux';

import entities, * as fromEntities from './entities';
import player, * as fromPlayer from './player';
import playlists, * as fromPlaylists from './playlists';

const rootReducer = combineReducers({ entities, player, playlists });

export default rootReducer;

export const getCurrentSong = state => {
  const currentSongId = fromPlayer.getCurrentSongId(state.player);
  return fromEntities.getSongById(state.entities, currentSongId);
};

export const getAuthorOfTheCurrentSong = state => {
  const currentSongId = fromPlayer.getCurrentSongId(state.player);
  return fromEntities.getAuthorOfTheSong(state.entities, currentSongId);
};

export const getSongsInPlaylist = (state, playlistName) => {
  const playlist = fromPlaylists.getPlaylistByName(
    state.playlists,
    playlistName,
  );
  if (!playlist) {
    return [];
  }
  const songsIds = fromPlaylists.getSongIdsInPlaylist(playlist);
  return songsIds.map(songId =>
    fromEntities.getSongById(state.entities, songId));
};

export const getUsers = state => fromEntities.getUsers(state.entities);
