import React, { useState, useEffect } from 'react';
import {theme} from '../services/Common/theme';
import {LineChart} from 'react-native-chart-kit';
import {
  Image,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import {actions} from '../services/State/Reducer';
import {useStateValue} from '../services/State/State';
import {
  getOverall
} from '../services/API/APIManager';

const Stats = () => {
  useEffect(() => {
    fetchOverall();
  }, []);

  const [annotations, setAnnotations] = useState(0);
  const [uploads, setUploads] = useState(0);
  const [verifications, setVerifications] = useState(0);
  const [, dispatch] = useStateValue();
  const fetchOverall = async () => {
    try {
      dispatch({
        type: actions.SET_OVERALL
      });
      const start = '01-01-2018';
      const end = new Date().toISOString().replace(/T.*/, '').split('-').reverse().join('-');
      const response = await getOverall(start, end);
      if (response && response.result) {
        let sum_anno = 0;
        sum_anno += response.result.tag_annotations.reduce((total, item) => total + Number(item.value), 0);
        sum_anno += response.result.text_annotations.reduce((total, item) => total + Number(item.value), 0);
        let sum_upload = 0;
        sum_upload += response.result.uploads.reduce((total, item) => total + Number(item.value), 0);
        let sum_verification = 0;
        sum_verification += response.result.verifications.reduce((total, item) => total + Number(item.value), 0);
        setAnnotations(sum_anno);
        setUploads(sum_upload);
        setVerifications(sum_verification);
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: 'Error Occured',
          message:
            'This Operation Could Not Be Completed. Please Try Again Later.',
          showConfirmButton: true,
          confirmText: 'Ok',
        },
      });
    } finally {
      dispatch({
        type: actions.SET_OVERALL,
        start_date: '01-01-2018',
        end_date: new Date().toISOString().replace(/T.*/, '').split('-').reverse().join('-')
      });
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <View style={styles.boxContainer}>
            <View style={styles.box}>
              <Image
                resizeMode="stretch"
                source={require('../assets/uploads.png')}
                style={{height: 20, width: 30}}
              />
              <Text style={styles.itemTitle}>Uploads</Text>
              <Text style={styles.itemValue}>{uploads}</Text>
            </View>
            <View style={styles.boxMini}>
              <Text style={styles.miniBoxValue}>2.7772782</Text>
              <Text style={styles.miniBoxFooter}>QUICRRA-0</Text>
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.box}>
              <Image
                resizeMode="stretch"
                source={require('../assets/annotations.png')}
                style={{height: 20, width: 30}}
              />
              <Text style={styles.itemTitle}>Annotations</Text>
              <Text style={styles.itemValue}>{annotations}</Text>
            </View>
            <View style={styles.boxMini}>
              <Text style={styles.miniBoxValue}>2.7772782</Text>
              <Text style={styles.miniBoxFooter}>QUICRRA-0</Text>
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.box}>
              <Image
                resizeMode="stretch"
                source={require('../assets/verifications.png')}
                style={{height: 20, width: 30}}
              />
              <Text style={styles.itemTitle}>Verifications</Text>
              <Text style={styles.itemValue}>{verifications}</Text>
            </View>
            <View style={styles.boxMini}>
              <Text style={styles.miniBoxValue}>0.00082</Text>
              <Text style={styles.miniBoxFooter}>QUICRRA-0</Text>
            </View>
          </View>
        </View>
        <View style={styles.fullWidthBox}>
          <Text style={styles.fullWidthBoxValue}>2.7772782</Text>
          <Text style={styles.miniBoxFooter}>QUICRRA-0</Text>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.graphContainer}>
            <Text style={styles.graphTitle}>CUMULATIVE UPLOAD COUNT</Text>
            <LineChart
              fromZero
              transparent
              height={200}
              yAxisSuffix="k"
              style={styles.graph}
              withVerticalLines={false}
              width={Dimensions.get('window').width}
              data={{
                labels: [2020, 2021],
                datasets: [
                  {
                    strokeWidth: 1,
                    withDots: false,
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
                  },
                ],
              }}
              chartConfig={{
                decimalPlaces: 0,
                fillShadowGradientOpacity: 1,
                fillShadowGradient: '#a5c4f8',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
            />
          </View>
          <View style={styles.graphContainer}>
            <Text style={styles.graphTitle}>CUMULATIVE EARNINGS</Text>
            <Text style={styles.miniBoxFooter}>QUICRRA-0</Text>
            <LineChart
              fromZero
              transparent
              height={200}
              yAxisSuffix="k"
              style={styles.graph}
              withVerticalLines={false}
              width={Dimensions.get('window').width}
              data={{
                labels: [2020, 2021],
                datasets: [
                  {
                    strokeWidth: 1,
                    withDots: false,
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
                  },
                ],
              }}
              chartConfig={{
                decimalPlaces: 0,
                fillShadowGradientOpacity: 1,
                fillShadowGradient: '#a5c4f8',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '2%',
    paddingTop: '6%',
    paddingHorizontal: '4%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: theme.COLORS.WHITE,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomContainer: {
    marginTop: '8%',
  },
  boxContainer: {
    flex: 0.333,
    margin: '1%',
  },
  graphContainer: {
    marginBottom: '10%',
    alignItems: 'center',
  },
  box: {
    paddingTop: '20%',
    borderRadius: 25,
    paddingBottom: '25%',
    alignItems: 'center',
    backgroundColor: '#F5F6FC',
  },
  boxMini: {
    marginTop: '10%',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: '3%',
    backgroundColor: '#F5F6FC',
  },
  fullWidthBox: {
    marginTop: '2%',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: '2%',
    backgroundColor: '#F5F6FC',
  },
  itemTitle: {
    fontSize: 10,
    marginTop: '5%',
    color: '#41474E',
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  miniBoxValue: {
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
  miniBoxFooter: {
    fontSize: 6,
    fontWeight: '300',
    fontFamily: 'Inter-Regular',
  },
  fullWidthBoxValue: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
  itemValue: {
    fontSize: 17,
    marginTop: '20%',
    color: '#41474E',
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
  graphTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  graph: {
    marginTop: '5%',
  },
});
