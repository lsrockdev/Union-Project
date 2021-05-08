import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import WalletSettings from "./screens/WalletSettings"

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <WalletSettings navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
