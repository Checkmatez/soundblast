import { normalize } from 'normalizr';

import * as types from './ActionTypes';
import { songSchema } from '../constants/Schemas';
import { constructUrl } from '../utils/SongUtils';

const requestSongs = playlist => ({
  type: types.REQUEST_SONGS,
  playlist,
});

const receiveSongs = (entities, songs, playlist, nextUrl, futureUrl) => ({
  type: types.RECEIVE_SONGS,
  entities,
  songs,
  playlist,
  nextUrl,
  futureUrl,
});

const getNextUrl = (playlist, playlists) => {
  const activePlaylist = playlists[playlist];
  if (activePlaylist && activePlaylist.nextUrl) {
    return activePlaylist.nextUrl;
  }
  return constructUrl(playlist);
};

const shouldFetchSongs = (playlist, playlists) => {
  const activePlaylist = playlists[playlist];
  // eslint-disable-next-line
  return !activePlaylist ||
    // eslint-disable-next-line
    !activePlaylist.isFetching && activePlaylist.nextUrl !== null;
};

export const fetchSongs = (url, playlist) => (dispatch, getState) => {
  dispatch(requestSongs(playlist));

  return fetch(url)
    .then(response => response.json())
    .then(json => {
      const nextUrl = json.next_href || null;
      const futureUrl = json.future_href || null;

      const songs = json.collection
        .map(song => song.origin || song)
        .filter(song => song.streamable && song.kind === 'track');

      const normalized = normalize(songs, [songSchema]);
      const result = normalized.result.reduce(
        (arr, songId) => {
          if (arr.indexOf(songId) === -1) {
            arr.push(songId);
          }
          return arr;
        },
        [],
      );

      dispatch(
        receiveSongs(normalized.entities, result, playlist, nextUrl, futureUrl),
      );
    })
    .catch(err => {
      throw err;
    });
};

export const fetchSongsIfNeeded = playlist => (dispatch, getState) => {
  const { playlists } = getState();
  if (!shouldFetchSongs(playlist, playlists)) {
    return null;
  }
  const nextUrl = getNextUrl(playlist, playlists);
  return dispatch(fetchSongs(nextUrl, playlist));
};
