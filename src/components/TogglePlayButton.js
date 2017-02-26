import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const PlayIconDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s ease-in-out;
  background-color: ${p => p.isPlaying ? 'rgba(0, 0, 0, 0.8)' : 'transparent'};

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
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
`;

class TogglePlayButton extends Component {
  togglePlay = () => {
    const { isPlaying } = this.props;
    const AudioElement = document.getElementById('audio');
    if (!AudioElement) {
      return;
    }

    if (isPlaying) {
      AudioElement.pause();
    } else {
      AudioElement.play();
    }
  };
  render() {
    const { isPlaying } = this.props;
    return (
      <PlayIconDiv onClick={this.togglePlay}>
        <Icon className={isPlaying ? 'fa fa-music' : 'fa fa-play'} />
      </PlayIconDiv>
    );
  }
}

const mapStateToProps = state => ({ isPlaying: state.player.isPlaying });

export default connect(mapStateToProps)(TogglePlayButton);
