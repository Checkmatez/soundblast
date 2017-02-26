import * as types from '../actions/ActionTypes';

const initialState = {
  currentSong: null,
  currentTime: 0,
  isPlaying: false,
};

const player = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_CURRENT_TIME:
      return { ...state, currentTime: action.time };
    case types.CHANGE_PLAYING_SONG:
      return { ...state, currentSong: action.songIndex };
    case types.CHANGE_IS_PLAYING:
      return { ...state, isPlaying: action.isPlaying };
    default:
      return state;
  }
};

export default player;

export const getCurrentSongId = state => state.currentSong;
