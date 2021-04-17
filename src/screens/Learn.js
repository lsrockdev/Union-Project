import React from 'react';
import {theme} from '../services/Common/theme';
import YoutubePlayer from 'react-native-youtube-iframe';
import {ScrollView, Text, View, StyleSheet} from 'react-native';

const Learn = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Welcome to the learning center</Text>
        <Text style={styles.text}>
          {`"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiu tempor incididunt ut labore et veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."`}
        </Text>
        <View style={styles.box}>
          <YoutubePlayer height={180} videoId={'LXb3EKWsInQ'} play={false} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Learn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '2%',
    paddingTop: '8%',
    paddingHorizontal: '8%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: theme.COLORS.WHITE,
  },
  header: {
    fontSize: 20,
    color: '#6C6C6C',
    fontWeight: '600',
    marginBottom: '6%',
    fontFamily: 'Inter-Regular',
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    fontWeight: '400',
    textAlign: 'justify',
    color: theme.COLORS.BLACK,
    fontFamily: 'Inter-Regular',
  },
  box: {
    backgroundColor: '#f2f2f2',
  },
});
