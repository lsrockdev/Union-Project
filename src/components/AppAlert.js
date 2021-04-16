import {
  Animated,
  BackAndroid,
  BackHandler,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Ripple from './Ripple';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const HwBackHandler = BackHandler || BackAndroid;
const HW_BACK_EVENT = 'hardwareBackPress';

const {OS} = Platform;

export default class Alert extends Component {
  constructor(props) {
    super(props);
    const {show} = this.props;
    this.springValue = new Animated.Value(0.3);

    this.state = {
      showSelf: false,
    };

    if (show) this._springShow(true);
  }

  componentDidMount() {
    HwBackHandler.addEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
  }

  _springShow = (fromConstructor) => {
    const {useNativeDriver = false} = this.props;
    this._toggleAlert(fromConstructor);
    Animated.spring(this.springValue, {
      toValue: 1,
      bounciness: 20,
      useNativeDriver,
    }).start();
  };

  _springHide = () => {
    const {useNativeDriver = false} = this.props;
    if (this.state.showSelf === true) {
      Animated.spring(this.springValue, {
        toValue: 0,
        tension: 20,
        useNativeDriver,
      }).start();
      setTimeout(() => {
        this._toggleAlert();
        this._onDismiss();
      }, 150);
    }
  };

  _toggleAlert = (fromConstructor) => {
    // eslint-disable-next-line react/no-direct-mutation-state
    if (fromConstructor) this.state = {showSelf: true};
    else this.setState({showSelf: !this.state.showSelf});
  };

  _handleHwBackEvent = () => {
    const {closeOnHardwareBackPress} = this.props;
    if (this.state.showSelf && closeOnHardwareBackPress) {
      this._springHide();
      return true;
    } else if (!closeOnHardwareBackPress && this.state.showSelf) {
      return true;
    }
    return false;
  };

  _onTapOutside = () => {
    const {closeOnTouchOutside} = this.props;
    if (closeOnTouchOutside) this._springHide();
  };

  _onDismiss = () => {
    const {onDismiss} = this.props;
    onDismiss && onDismiss();
  };

  _renderButton = (data) => {
    const {text, onPress, backgroundColor} = data;
    return (
      <Ripple
        outerStyle={{backgroundColor: backgroundColor, ...styles.buttonOuter}}
        innerStyle={styles.buttonInner}
        onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </Ripple>
    );
  };

  _renderAlert = () => {
    const animation = {transform: [{scale: this.springValue}]};
    const {title, message, type} = this.props;
    const {
      showCancelButton,
      cancelText,
      cancelButtonStyle,
      cancelButtonTextStyle,
      onCancelPressed,
    } = this.props;
    const {
      showConfirmButton,
      confirmText,
      confirmButtonStyle,
      confirmButtonTextStyle,
      onConfirmPressed,
    } = this.props;

    const cancelButtonData = {
      text: cancelText,
      backgroundColor: '#ed3237',
      buttonStyle: cancelButtonStyle,
      buttonTextStyle: cancelButtonTextStyle,
      onPress: () => {
        this._springHide();
        setTimeout(onCancelPressed, 200);
      },
    };

    const confirmButtonData = {
      text: confirmText,
      backgroundColor: '#67c590',
      buttonStyle: confirmButtonStyle,
      buttonTextStyle: confirmButtonTextStyle,
      onPress: () => {
        this._springHide();
        setTimeout(onConfirmPressed, 200);
      },
    };

    const colors = {
      success: '#23b574',
      error: '#ed3237',
      info: '#46B8DA',
      warn: '#f7b217',
    };

    const iconStyle = {
      size: 30,
      color: '#fff',
    };

    const icons = {
      info: <FontAwesomeIcon name="info" {...iconStyle} />,
      warn: <AntIcon name="exclamation" {...iconStyle} />,
      success: <FeatherIcon name="check" {...iconStyle} />,
      error: <FontAwesomeIcon name="remove" {...iconStyle} />,
    };

    return (
      <View style={styles.container}>
        <View style={styles.overlay} />
        <Animated.View style={[styles.contentContainer, animation]}>
          <View
            style={{
              position: 'absolute',
              right: 0,
              left: 0,
              top: -30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                padding: 2,
                elevation: 5,
                borderRadius: 50,
                borderWidth: 0.5,
                backgroundColor: '#fff',
                borderColor: colors[type],
              }}>
              <View
                style={{
                  backgroundColor: colors[type],
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                  height: 50,
                }}>
                {icons[type]}
              </View>
            </View>
          </View>
          <View
            style={{
              marginVertical: 10,
              marginTop: 30,
              alignItems: 'center',
            }}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>
          {showCancelButton || showConfirmButton ? (
            <View style={styles.action}>
              {showCancelButton ? this._renderButton(cancelButtonData) : null}
              {showConfirmButton ? this._renderButton(confirmButtonData) : null}
            </View>
          ) : null}
        </Animated.View>
      </View>
    );
  };

  render() {
    const {show, showSelf} = this.state;
    const {modalProps = {}, closeOnHardwareBackPress} = this.props;

    const wrapInModal = OS === 'android' || OS === 'ios';

    return showSelf ? (
      wrapInModal ? (
        <Modal
          animationType="none"
          transparent={true}
          visible={show}
          statusBarTranslucent={true}
          onRequestClose={() => {
            if (showSelf && closeOnHardwareBackPress) {
              this._springHide();
            }
          }}
          {...modalProps}>
          {this._renderAlert()}
        </Modal>
      ) : (
        this._renderAlert()
      )
    ) : null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {show} = nextProps;
    const {showSelf} = this.state;

    if (show && !showSelf) this._springShow();
    else if (show === false && showSelf) this._springHide();
  }

  componentWillUnmount() {
    HwBackHandler.removeEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(52,52,52,0.5)',
  },
  contentContainer: {
    maxWidth: '75%',
    minWidth: '75%',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonOuter: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
  },
});

Alert.propTypes = {
  show: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
  showProgress: PropTypes.bool,
  type: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  closeOnTouchOutside: PropTypes.bool,
  closeOnHardwareBackPress: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  cancelButtonColor: PropTypes.string,
  confirmButtonColor: PropTypes.string,
  onCancelPressed: PropTypes.func,
  onConfirmPressed: PropTypes.func,
  customView: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.func,
  ]),
  modalProps: PropTypes.object,
};

Alert.defaultProps = {
  show: false,
  useNativeDriver: false,
  showProgress: false,
  closeOnTouchOutside: true,
  closeOnHardwareBackPress: true,
  showCancelButton: false,
  showConfirmButton: false,
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelButtonColor: '#D0D0D0',
  confirmButtonColor: '#AEDEF4',
  customView: null,
  modalProps: {},
};
