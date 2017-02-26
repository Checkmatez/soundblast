import merge from 'lodash/merge';

const initialState = {
  playlists: {},
  songs: {},
  users: {},
};

export default function entities(state = initialState, action) {
  if (action.entities) {
    return merge({}, state, action.entities);
  }

  return state;
}

const initialSong = {
  id: null,
  stream_url: '',
  artwork_url: '',
  title: '',
  user_id: null,
};

export const getSongById = (state, songId) =>
  state.songs[songId] || initialSong;

export const getUserById = (state, userId) => state.users[userId] || {};

export const getUsers = state => state.users;

export const getAuthorOfTheSong = (state, songId) => {
  if (state.songs[songId] && state.songs[songId].user_id) {
    return getUserById(state, state.songs[songId].user_id);
  }
  return {};
};
