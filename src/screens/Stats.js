import React from 'react';
import {theme} from '../services/Common/theme';
import {ScrollView, Text, View, StyleSheet} from 'react-native';

const Stats = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Stats</Text>
      </ScrollView>
    </View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '2%',
    paddingTop: '8%',
    paddingHorizontal: '4%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: theme.COLORS.WHITE,
  },
  header: {
    fontSize: 20,
    color: '#6C6C6C',
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
});
