import React, {useRef} from 'react';
import styled from 'styled-components/native';
import {theme} from '../services/Common/theme';
import {Transition, Transitioning} from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
const icons = {
  About: (
    <MaterialIcon
      name="info"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_NOT_ICON_FOCUSED}
    />
  ),
  AboutFocused: (
    <MaterialIcon
      name="info"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_ICON_FOCUSED}
    />
  ),
  Stats: (
    <MaterialIcon
      name="analytics"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_NOT_ICON_FOCUSED}
    />
  ),
  StatsFocused: (
    <MaterialIcon
      name="analytics"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_ICON_FOCUSED}
    />
  ),
  SwipeAI: (
    <MaterialIcon
      name="swipe"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_NOT_ICON_FOCUSED}
    />
  ),
  SwipeAIFocused: (
    <MaterialIcon
      name="swipe"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_ICON_FOCUSED}
    />
  ),
  Learn: (
    <MaterialIcon
      name="subscriptions"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_NOT_ICON_FOCUSED}
    />
  ),
  LearnFocused: (
    <MaterialIcon
      name="subscriptions"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_ICON_FOCUSED}
    />
  ),
  Wallet: (
    <MaterialIcon
      name="account-balance-wallet"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_NOT_ICON_FOCUSED}
    />
  ),
  WalletFocused: (
    <MaterialIcon
      name="account-balance-wallet"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_ICON_FOCUSED}
    />
  ),
  MyStats: (
    <IonIcon
      name="analytics-sharp"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_NOT_ICON_FOCUSED}
    />
  ),
  MyStatsFocused: (
    <IonIcon
      name="analytics-sharp"
      size={24}
      color={theme.COLORS.BOTTOM_TAB_ICON_FOCUSED}
    />
  ),
};

const Container = styled.TouchableWithoutFeedback``;
const Background = styled(Transitioning.View)`
  flex: auto;
  margin: 8px;
  flex-direction: row;
  align-items: center;
  border-radius: 100px;
  justify-content: center;
  background: ${props => (props.focused ? theme.APP_COLOR : 'transparent')};
`;

function Tab({label, accessibilityState, onPress}) {
  const focused = accessibilityState.selected;
  const icon = focused ? icons[label] : icons[`${label}Focused`];

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="fade" durationMs={0} />
      <Transition.Change interpolation="easeInOut" durationMs={100} />
      <Transition.In type="fade" durationMs={10} />
    </Transition.Sequence>
  );

  const ref = useRef();

  return (
    <Container
      onPress={() => {
        ref.current.animateNextTransition();
        onPress();
      }}>
      <Background
        ref={ref}
        label={label}
        focused={focused}
        transition={transition}>
        {icon}
      </Background>
    </Container>
  );
}

export default Tab;
