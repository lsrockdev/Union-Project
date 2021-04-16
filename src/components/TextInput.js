import React, {Component} from 'react';
import {View, Animated, TextInput, Text} from 'react-native';

class Input extends Component {
  state = {
    isFocused: false,
  };

  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value || this.props.placeholder ? 1 : 0,
    );
  }

  handleFocus = () => this.setState({isFocused: true});

  handleBlur = () => this.setState({isFocused: false});

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue:
        this.state.isFocused || this.props.value || this.props.placeholder
          ? 1
          : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const {
      label = '',
      icon = null,
      type = 'default',
      isTextArea = false,
      length = null,
      height = 55,
      style = {},
      editable = true,
      ...props
    } = this.props;
    const labelStyle = {
      position: 'absolute',
      width: '100%',
      left: '6%',
      bottom: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['25%', '5%'],
      }),
      top: isTextArea
        ? this._animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [15, 3],
          })
        : this._animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: ['35%', '13%'],
          }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 10],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#36373a', '#000'],
      }),
    };

    const innerView = (
      <>
        <View
          style={{
            width: icon ? '85%' : '100%',
            paddingHorizontal: '5%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          {type === 'phone-number' ? (
            <View style={{flexDirection: 'row', height: '100%'}}>
              <View
                style={{
                  flex: 0.16,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#000',
                  }}>
                  (+92)
                </Text>
              </View>
              <TextInput
                {...props}
                placeholder={label}
                maxLength={length}
                onChangeText={(text) => {
                  if (text.length === 1) {
                    this.props.onChangeText(text.replace(/[^3]/g, ''));
                  } else {
                    this.props.onChangeText(text.replace(/[^0-9]/g, ''));
                  }
                }}
                placeholderTextColor="#36373a"
                keyboardType="phone-pad"
                style={{
                  flex: 0.84,
                  width: '100%',
                  color: '#000',
                  marginLeft: 5,
                }}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                editable={editable}
              />
            </View>
          ) : (
            <>
              <Animated.Text style={labelStyle}>{label}</Animated.Text>
              <TextInput
                {...props}
                style={{
                  height: isTextArea ? height : 'auto',
                  marginTop:
                    this.state.isFocused ||
                    this.props.value ||
                    this.props.placeholder
                      ? '4%'
                      : 0,
                  width: '100%',
                  color: '#000',
                }}
                keyboardType={
                  ['cnic', 'number'].includes(type)
                    ? 'phone-pad'
                    : type === 'email'
                    ? 'email-address'
                    : 'default'
                }
                value={props.value ? `${props.value}` : props.value}
                editable={editable}
                multiline={isTextArea}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChangeText={(text) => {
                  if (type && type === 'name') {
                    this.props.onChangeText(text.replace(/[^a-zA-Z. ]/g, ''));
                  } else if (type && type === 'number') {
                    this.props.onChangeText(text.replace(/[^0-9]/g, ''));
                  } else if (type && type === 'cnic') {
                    this.props.onChangeText(text.replace(/[^0-9]-/g, ''));
                  } else {
                    this.props.onChangeText(text);
                  }
                }}
                maxLength={length}
                blurOnSubmit={!isTextArea}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </>
          )}
        </View>
        {icon ? <View style={{width: '15%'}}>{icon}</View> : null}
      </>
    );

    const boxOuter = {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: this.state.isFocused ? 2 : 0,
        borderColor: this.state.isFocused ? '#0faeaa' : null,
        elevation: 5,
        shadowRadius: 2,
        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        marginVertical: 5,
      },
      boxInner = {
        minHeight: 55,
        maxHeight: isTextArea ? 200 : 55,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      };

    return (
      <View style={style}>
        <View style={{...boxOuter, ...boxInner}}>{innerView}</View>
      </View>
    );
  }
}

export default Input;
