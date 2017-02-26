import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';

import { toggleIsPlaying, changeCurrentTime } from '../actions/PlayerActions';
import {
  formatSeconds,
  formatStreamUrl,
  formatSongTitle
} from '../utils/FormatUtils';
import { offsetLeft } from '../utils/MouseUtils';
import LocalStorageUtils from '../utils/LocalStorageUtils';
import { getCurrentSong, getAuthorOfTheCurrentSong } from '../reducers';

const StickyFooter = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #e3e3e3;
  z-index: 999;
`;

const DivContainer = styled.div`
  display: flex;
  height: 43px;
  flex-flow: row nowrap;
  align-items: center;
  max-width: 1170px;
  margin: 0 auto;
  padding: 5px 0;
`;

const SongArtwork = styled.img`
  float: left;
  width: 2em;
  height: 2em;
  margin: 0 0.5em;
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

const Icon = styled.i`
  color: inherit;
`;

const SeekBarWrap = styled.div`
  padding: 8px 0;
  flex: 1;

  &:hover {
    cursor: pointer;
  }
`;

const SeekBar = styled.div`
  position: relative;
  height: 2px;
  background-color: #ddd;
`;

const SeekDurationBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #A6D2A5;
  height: 100%;
  width: ${props => props.width}%
`;
SeekDurationBar.defaultProps = { width: 10 };

const PlayerSeekHandle = styled.div`
  position: absolute;
  top: -5px;
  right: -6px;
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #e3e3e3;
`;

const PlayerTime = styled.div`
  font-size: 0.7rem;
  color: #ccc;
`;

const PlayerTimeDivider = styled.span`
  margin: 0 0.7em;
`;

const IconContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  color: #ccc;

  &:hover {
    cursor: pointer;
    color: #222;
  }
`;

const FlexItem = styled.div`
  flex: ${p => p.grow} 1 auto;
  display: flex;
  flex-flow: row nowrap;
  width: ${p => p.width}px;
  margin-left: ${p => p.marginLeft}em;
  margin-right: ${p => p.marginRight}em;
  justify-content: ${p => p.justifyContent};
`;
FlexItem.defaultProps = {
  grow: 0,
  width: 100,
  marginLeft: 0,
  marginRight: 1,
  justifyContent: 'center'
};

class FooterPlayer extends Component {
  static propTypes = {
    song: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.audio = null;
    this.seekBar = null;

    const previousVolumeLevel = Number.parseFloat(
      LocalStorageUtils.get('volume')
    );
    this.state = {
      duration: 0,
      volume: previousVolumeLevel || 1,
      muted: false,
      isSeeking: false,
      isChangingVolume: false
    };
  }

  componentDidMount() {
    this.audio.volume = this.state.volume;
    this.audio.addEventListener('pause', this.handlePause);
    this.audio.addEventListener('play', this.handlePlay);
    this.audio.addEventListener('loadedmetadata', this.handleLoadedMetadata);
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
    this.audio.addEventListener('volumechange', this.handleVolumeChange);
  }

  componentWillUnmount() {
    this.audio.removeEventListener('pause', this.handlePause);
    this.audio.removeEventListener('play', this.handlePlay);
    this.audio.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
    this.audio.removeEventListener('timeupdate', this.handleLoadedMetadata);
    this.audio.removeEventListener('volumechange', this.handleVolumeChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.player.isPlaying && !this.props.player.isPlaying) {
      this.audio.pause();
    }

    if (!prevProps.player.isPlaying && this.props.player.isPlaying) {
      this.audio.play();
    }
  }

  handlePause = () => {
    const { dispatch } = this.props;
    dispatch(toggleIsPlaying(false));
  };

  handlePlay = () => {
    const { dispatch } = this.props;
    dispatch(toggleIsPlaying(true));
  };

  handleLoadedMetadata = () => {
    this.setState({ duration: Math.floor(this.audio.duration) });
  };

  handleTimeUpdate = e => {
    if (this.state.isSeeking) {
      return;
    }

    const { dispatch, player } = this.props;
    const currentTime = Math.floor(e.currentTarget.currentTime);

    if (currentTime === player.currentTime) {
      return;
    }
    dispatch(changeCurrentTime(currentTime));
  };

  handleVolumeChange = e => {
    const volume = e.currentTarget.volume;
    this.setState({ volume });
    LocalStorageUtils.set('volume', volume);
  };

  seek = e => {
    const { dispatch } = this.props;
    const { duration } = this.state;
    const percent = (e.clientX - offsetLeft(e.currentTarget)) /
      e.currentTarget.offsetWidth;
    const currentTime = Math.floor(percent * duration);

    dispatch(changeCurrentTime(currentTime));
    this.audio.currentTime = currentTime;
  };

  changeVolume = e => {
    const volume = (e.clientX - offsetLeft(e.currentTarget)) /
      e.currentTarget.offsetWidth;

    this.audio.volume = volume;
  };

  toggleMute = () => {
    this.audio.muted = !this.state.muted;
    this.setState({ muted: !this.state.muted });
  };

  togglePlay = () => {
    if (this.props.player.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
  };

  handleMouseClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleSeekMouseDown = e => {
    this.bindSeekMouseEvents();
    this.setState({ isSeeking: true });
  };

  handleVolumeMouseDown = e => {
    this.bindVolumeMouseEvents();
    this.setState({ isChangingVolume: true });
  };

  bindSeekMouseEvents = () => {
    document.addEventListener('mousemove', this.handleSeekMouseMove);
    document.addEventListener('mouseup', this.handleSeekMouseUp);
  };

  bindVolumeMouseEvents = () => {
    document.addEventListener('mousemove', this.handleVolumeMouseMove);
    document.addEventListener('mouseup', this.handleVolumeMouseUp);
  };

  handleSeekMouseMove = e => {
    const { dispatch } = this.props;
    const { duration } = this.state;
    const seekBar = ReactDOM.findDOMNode(this.seekBar);
    const diff = e.clientX - offsetLeft(seekBar);
    const pos = diff < 0 ? 0 : diff;
    let percent = pos / seekBar.offsetWidth;
    percent = percent > 1 ? 1 : percent;

    dispatch(changeCurrentTime(Math.floor(percent * duration)));
  };

  handleVolumeMouseMove = e => {
    const volumeBar = ReactDOM.findDOMNode(this.volumeBar);
    const diff = e.clientX - offsetLeft(volumeBar);
    const pos = diff < 0 ? 0 : diff;
    let percent = pos / volumeBar.offsetWidth;
    percent = percent > 1 ? 1 : percent;

    this.setState({
      volume: percent
    });
    this.audio.volume = percent;
  };

  handleSeekMouseUp = () => {
    if (!this.state.isSeeking) {
      return;
    }

    document.removeEventListener('mousemove', this.handleSeekMouseMove);
    document.removeEventListener('mouseup', this.handleSeekMouseUp);

    const { currentTime } = this.props.player;

    this.setState({ isSeeking: false }, () => {
      this.audio.currentTime = currentTime;
    });
  };

  handleVolumeMouseUp = () => {
    if (!this.state.isChangingVolume) {
      return;
    }

    document.removeEventListener('mousemove', this.handleVolumeMouseMove);
    document.removeEventListener('mouseup', this.handleVolumeMouseUp);

    this.setState({ isChangingVolume: false });
    LocalStorageUtils.set('volume', this.state.volume);
  };

  renderPlayerInfo = () => {
    const { song, user } = this.props;
    return (
      <FlexItem grow={1}>
        {song.artwork_url
          ? <SongArtwork src={`${song.artwork_url}`} alt="song artwork" />
          : null}
        <div>
          <StyledSongLink to={`songs/${song.id}`} title={song.title}>
            {formatSongTitle(song.title)}
          </StyledSongLink>
          <StyledUserLink to={`users/${user.id}`} title={user.username}>
            {user.username}
          </StyledUserLink>
        </div>
      </FlexItem>
    );
  };

  renderControls = () => {
    const { player } = this.props;
    return (
      <FlexItem width={120}>
        <IconContainer>
          <Icon className="fa fa-backward" />
        </IconContainer>
        <IconContainer onClick={this.togglePlay}>
          <Icon className={player.isPlaying ? 'fa fa-pause' : 'fa fa-play'} />
        </IconContainer>
        <IconContainer>
          <Icon className="fa fa-forward" />
        </IconContainer>
      </FlexItem>
    );
  };

  renderPlayerSeek = () => {
    const { currentTime } = this.props.player;
    const { duration } = this.state;
    const width = duration === 0 ? 0 : currentTime / duration * 100;
    return (
      <FlexItem grow={2}>
        <SeekBarWrap onClick={this.seek} ref={node => this.seekBar = node}>
          <SeekBar>
            <SeekDurationBar width={width}>
              <PlayerSeekHandle
                onClick={this.handleMouseClick}
                onMouseDown={this.handleSeekMouseDown}
              />
            </SeekDurationBar>
          </SeekBar>
        </SeekBarWrap>
      </FlexItem>
    );
  };

  renderTime = () => {
    const { currentTime } = this.props.player;
    const { duration } = this.state;
    return (
      <FlexItem>
        <PlayerTime>
          <span>{formatSeconds(currentTime)}</span>
          <PlayerTimeDivider>/</PlayerTimeDivider>
          <span>{formatSeconds(duration)}</span>
        </PlayerTime>
      </FlexItem>
    );
  };

  renderButtons = () => {
    return (
      <FlexItem width={30} justifyContent={'flex-end'}>
        <IconContainer onClick={this.toggleMute}>
          <Icon
            className={
              `fa ${this.state.muted ? 'fa-volume-off' : 'fa-volume-up'}`
            }
          />
        </IconContainer>
      </FlexItem>
    );
  };

  renderVolume = () => {
    const { volume } = this.state;
    const width = volume * 100;
    return (
      <FlexItem>
        <SeekBarWrap
          onClick={this.changeVolume}
          ref={node => this.volumeBar = node}
        >
          <SeekBar>
            <SeekDurationBar width={width}>
              <PlayerSeekHandle
                onClick={this.handleMouseClick}
                onMouseDown={this.handleVolumeMouseDown}
              />
            </SeekDurationBar>
          </SeekBar>
        </SeekBarWrap>
      </FlexItem>
    );
  };

  render() {
    const { song } = this.props;
    return (
      <StickyFooter>
        <DivContainer>
          <audio
            src={song.stream_url ? formatStreamUrl(song.stream_url) : ''}
            id="audio"
            ref={node => this.audio = node}
          />
          {this.renderPlayerInfo()}
          {this.renderControls()}
          {this.renderPlayerSeek()}
          {this.renderTime()}
          {this.renderButtons()}
          {this.renderVolume()}
        </DivContainer>
      </StickyFooter>
    );
  }
}

const mapStateToProps = state => ({
  song: getCurrentSong(state),
  user: getAuthorOfTheCurrentSong(state),
  player: state.player
});

export default connect(mapStateToProps)(FooterPlayer);
