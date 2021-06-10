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

  const Coff_Uploads = 20 / 1000000;
  const Coff_Annotations = 20 / 1000000; //Stats 5) formula still in work
  const Coff_Verifications = 20 / 2000000;

  const [annotations, setAnnotations] = useState(0);
  const [uploads, setUploads] = useState(0);
  const [verifications, setVerifications] = useState(0);

  const [uploadsQuicrra, setUploadsQuicrra] = useState(0);
  const [annotationsQuicrra, setAnnotationsQuicrra] = useState(0);
  const [verificationsQuicrra, setVerificationsQuicrra] = useState(0);
  const [cumuQuicrra, setCumuQuicrra] = useState(0);

  const [uploadsDataset, setUploadsDataset] = useState(0);
  const [annoDataset, setAnnoDataset] = useState(0);
  const [veriDataset, setVeriDataset] = useState(0);

  const [chartDataX, setChartDataX] = useState([]); //datetime
  const [chartDataY, setChartDataY] = useState([]); //datavalue

  const [, dispatch] = useStateValue();

  let arr_uploads = [];
  let arr_annotations = [];
  let arr_verifications = [];


  const updateChart = (chartType)=>{
    chartDataX.empty();
    chartDataY.empty();
    console.log(JSON.stringify(chartDataX));
    console.log(JSON.stringify(chartDataY));

    if (chartType == 'uploads') {
      arr_uploads.map(({date, value})=>{
        chartDataX.push(date);
        chartDataY.push(value);
      });
    } else if (chartType == "annotations") {
      arr_annotations.map(({date, value})=>{
        chartDataX.push(date);
        chartDataY.push(value);
      });
    } else if (chartType == "verifications") {
      arr_verifications.map(({date, value})=>{
        chartDataX.push(date);
        chartDataY.push(value);
      });
    }

    setChartDataX(chartDataX);
    setChartDataY(chartDataY);
  };


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

        console.log(JSON.stringify(response));

        sum_anno += response.result.tag_annotations.reduce((total, item) => total + Number(item.value), 0);
        sum_anno += response.result.text_annotations.reduce((total, item) => total + Number(item.value), 0);
        let sum_upload = 0;
        sum_upload += response.result.uploads.reduce((total, item) => total + Number(item.value), 0);
        let sum_verification = 0;
        sum_verification += response.result.verifications.reduce((total, item) => total + Number(item.value), 0);

        response.result.uploads.map(({date, value})=>{
          arr_uploads.push({date:(date.split("-")[2] || ""), value:value});
        });


        response.result.verifications.map(({date, value})=>{
          arr_annotations.push({date:(date.split("-")[2] || ""), value:value});
        });

        response.result.text_annotations
        .map(({date, value})=>{
          arr_verifications.push({date:(date.split("-")[2] || ""), value:value});
        });
        response.result.tag_annotations
        .map(({date, value})=>{
          arr_verifications.push({date:(date.split("-")[2] || ""), value:value});
        });

        arr_verifications.sort((a, b) =>{
          return Number(a.date) < Number(b.date) 
        });



        setAnnotations(sum_anno);
        setUploads(sum_upload);
        setVerifications(sum_verification);

        let upload_rra = sum_upload * Coff_Uploads;
        let anno_rra = sum_anno * Coff_Annotations;
        let veri_rra = sum_verification * Coff_Verifications;

        setUploadsQuicrra(Number(upload_rra.toFixed(8)));
        setAnnotationsQuicrra(Number(anno_rra.toFixed(8)));
        setVerificationsQuicrra(Number(veri_rra.toFixed(8)));
        setCumuQuicrra(Number((upload_rra + anno_rra + veri_rra).toFixed(8)));

        console.log("");

        updateChart('uploads');


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
              <Text style={styles.miniBoxValue}>{uploadsQuicrra}</Text>
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
              <Text style={styles.miniBoxValue}>{annotationsQuicrra}</Text>
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
              <Text style={styles.miniBoxValue}>{verificationsQuicrra}</Text>
              <Text style={styles.miniBoxFooter}>QUICRRA-0</Text>
            </View>
          </View>
        </View>
        <View style={styles.fullWidthBox}>
          <Text style={styles.fullWidthBoxValue}>{cumuQuicrra}</Text>
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
                labels: chartDataX,
                datasets: [
                  {
                    strokeWidth: 1,
                    withDots: false,
                    data: chartDataY,
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
