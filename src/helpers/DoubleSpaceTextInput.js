// DoubleSpaceTextInput.js

import React from 'react';
import {TextInput} from 'react-native';

const withDoubleSpaceConversion = WrappedComponent => {
  return class extends React.Component {
    state = {
      text: '',
    };

    handleKeyPress = ({nativeEvent}) => {
      if (nativeEvent.key === ' ' && this.state.text.endsWith(' ')) {
        // Replace the last space with a dot
        this.setState(prevState => ({
          text: prevState.text.slice(0, -1) + '.',
        }));
      }
    };

    onChangeText = newText => {
      this.setState({text: newText});
    };

    render() {
      return (
        <WrappedComponent
          value={this.state.text}
          onChangeText={this.onChangeText}
          onKeyPress={this.handleKeyPress}
          {...this.props}
        />
      );
    }
  };
};

export default withDoubleSpaceConversion;
