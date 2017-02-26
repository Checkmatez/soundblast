import * as types from './ActionTypes';

export const changeCurrentTime = time => ({
  type: types.CHANGE_CURRENT_TIME,
  time,
});

export const changePlayingSong = songIndex => ({
  type: types.CHANGE_PLAYING_SONG,
  songIndex,
});

export const toggleIsPlaying = isPlaying => ({
  type: types.CHANGE_IS_PLAYING,
  isPlaying,
});

export const playSong = songIndex => (dispatch, getState) => {
  dispatch(changeCurrentTime(0));
  dispatch(changePlayingSong(songIndex));
  dispatch(toggleIsPlaying(!getState().player.isPlaying));
};
