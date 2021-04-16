import React, {useState, useEffect, useRef} from 'react';
import {View, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import TextBox from './TextBox';
import moment from 'moment';

const DateTimeInput = (props) => {
  let refDatePicker = useRef(null);
  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setShowPicker(false);
    setPickerMode(props.mode === 'datetime' ? 'date' : props.mode);
    setTemp('');
  };

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('');
  const [temp, setTemp] = useState(new Date());

  const onChangeAndroid = (e, val) => {
    if (val) {
      if (mode === 'datetime') {
        if (pickerMode === 'date') {
          onChange(val);
          setTemp(val);
          setPickerMode('time');
        } else {
          setShowPicker(false);
          reset();
          onChange(
            moment(
              `${moment(temp).format('YYYY/MM/DD')} ${moment(val).format(
                'HH:mm:ss',
              )}`,
            ),
          );
        }
      } else {
        setShowPicker(false);
        reset();
        onChange(val);
      }
    } else {
      reset();
      setShowPicker(false);
    }
  };

  const onChangeIOS = (str, val) => {
    if (val) {
      onChange(val);
    }
  };

  const onShowPicker = () => {
    if (Platform.OS === 'android') {
      setShowPicker(true);
    } else if (Platform.OS === 'ios') {
      refDatePicker.current.onPressDate();
    }
  };

  const getFormattedValue = () => {
    const {value = '', mode = ''} = props || {};
    if (value) {
      if (mode === 'datetime') {
        return moment(value).format('MMM DD, YYYY hh:mm A');
      } else if (mode === 'date') {
        return moment(value).format('MMM DD, YYYY');
      } else if (mode === 'time') {
        return moment(value).format('hh:mm A');
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  const {
    label = '',
    icon = null,
    mode = 'datetime',
    value = '',
    onChange = () => {},
    maxDate = null,
    minDate = null,
    style = {},
  } = props;

  return (
    <>
      <TextBox
        icon={icon}
        title={label}
        style={style}
        value={getFormattedValue()}
        onPress={onShowPicker}
      />
      {showPicker ? (
        <DateTimePicker
          mode={Platform.OS === 'ios' ? mode : pickerMode}
          value={value ? new Date(moment(value)) : new Date()}
          display="spinner"
          onChange={onChangeAndroid}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      ) : null}
      <View style={{height: 0, width: 0, opacity: 0}}>
        <DatePicker
          ref={refDatePicker}
          date={value}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          mode={mode}
          customStyles={{
            datePicker: {
              justifyContent: 'center',
            },
          }}
          onDateChange={onChangeIOS}
          minDate={minDate}
          maxDate={maxDate}
        />
      </View>
    </>
  );
};

export default DateTimeInput;
