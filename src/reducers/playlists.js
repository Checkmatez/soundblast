import * as types from '../actions/ActionTypes';

const initialState = {
  isFetching: false,
  items: [],
  futureUrl: null,
  nextUrl: null,
};

const playlist = (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_SONGS:
      return { ...state, isFetching: true, nextUrl: null };
    case types.RECEIVE_SONGS:
      return {
        ...state,
        isFetching: false,
        items: [...state.items, ...action.songs],
        futureUrl: action.futureUrl,
        nextUrl: action.nextUrl,
      };
    default:
      return state;
  }
};

const playlists = (state = {}, action) => {
  switch (action.type) {
    case types.REQUEST_SONGS:
    case types.RECEIVE_SONGS:
      const newPlaylist = playlist(state[action.playlist], action);
      return { ...state, ...{ [action.playlist]: newPlaylist } };
    default:
      return state;
  }
};

export default playlists;

export const getPlaylistByName = (state, playlistName) => state[playlistName];

export const getSongIdsInPlaylist = (state) => state.items;
