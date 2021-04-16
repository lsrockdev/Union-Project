import React from 'react';
import {
  View,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';

const Ripple = (props) => {
  const makeTouchable = (TouchableComponent) => {
    const Touchable =
      TouchableComponent ||
      Platform.select({
        android: TouchableNativeFeedback,
        ios: TouchableHighlight,
        default: TouchableHighlight,
      });
    let defaultTouchableProps = {};
    if (Touchable === TouchableHighlight) {
      defaultTouchableProps = {underlayColor: 'rgba(0, 0, 0, 0.1)'};
    }
    return {Touchable, defaultTouchableProps};
  };

  const {Touchable, defaultTouchableProps} = makeTouchable();

  const {outerStyle = {}, innerStyle = {}, children = null} = props || {};

  const touchable = (
    <Touchable {...defaultTouchableProps} {...props}>
      <View style={innerStyle}>{children}</View>
    </Touchable>
  );

  return Platform.OS === 'android' ? (
    <View
      style={{
        ...outerStyle,
        overflow: 'hidden',
      }}>
      {touchable}
    </View>
  ) : (
    <View style={outerStyle}>
      <View
        style={{
          overflow: 'hidden',
          borderRadius: outerStyle.borderRadius ? outerStyle.borderRadius : 0,
        }}>
        {touchable}
      </View>
    </View>
  );
};

export default Ripple;
