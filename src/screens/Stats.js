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
import Button from '../components/Button';
import {actions} from '../services/State/Reducer';
import {useStateValue} from '../services/State/State';
import {
  getOverall
} from '../services/API/APIManager';

import {
  calcUploadsCumu,
  calcAnnoDescCumu,
  calcAnnoTagCumu,
  calcVeriCumu
} from '../services/Common/CommonFunctions';

var _arr_uploads = [];
var _arr_annotations = [];
var _arr_verifications = [];

const Stats = () => {
  useEffect(() => {
    fetchOverall();
  }, []);

  const [annotations, setAnnotations] = useState(0);
  const [uploads, setUploads] = useState(0);
  const [verifications, setVerifications] = useState(0);

  const [uploadsQuicrra, setUploadsQuicrra] = useState(0);
  const [annotationsQuicrra, setAnnotationsQuicrra] = useState(0);
  const [verificationsQuicrra, setVerificationsQuicrra] = useState(0);
  const [cumuQuicrra, setCumuQuicrra] = useState(0);

  const [graphTitle, setGraphTitle] = useState("UPLOAD");
  
  const [curChartState, setCurChartState] = useState('uploads');

  const curYear = Number(new Date().toISOString().replace(/T.*/, '').split('-')[0]);


  const [curChartdata, setCurChartdata] = useState({
    labels: [(curYear-1).toString(), curYear.toString()],
    datasets: [
      {
        strokeWidth: 1,
        withDots: false,
        data: [0]
      },
    ],
  });

  const [curCumuChartdata, setCurCumuChartdata] = useState({
    labels: [(curYear-1).toString(), curYear.toString()],
    datasets: [
      {
        strokeWidth: 1,
        withDots: false,
        data: [0]
      },
    ],
  });

  //authToken
  const [, dispatch] = useStateValue();

  
  //Get uploads/annotations/verification cumulative points per date
  const sumCumuData = (response)=> {
    let cumuData = [];
    //calc uploads per day cumu
    response.result.uploads.map(({date, value})=>{
      let index = cumuData.findIndex(i=>i.date === date);
      if (index == -1){
        cumuData.push({date:date, value:calcUploadsCumu(value)});
      } else {
        cumuData[index].value += calcUploadsCumu(value);
      } 
    });

    //calc verifications per day cumu
    response.result.verifications.map(({date, value})=>{
      let index = cumuData.findIndex(i=>i.date === date);
      if (index == -1){
        cumuData.push({date:date, value:calcVeriCumu(value)});
      } else {
        cumuData[index].value += calcVeriCumu(value);
      } 
    });

    //calc text annotations per day cumu
    response.result.text_annotations.map(({date, value})=>{
      let index = cumuData.findIndex(i=>i.date === date);
      if (index == -1){
        cumuData.push({date:date, value:calcAnnoDescCumu(value)});
      } else {
        cumuData[index].value += calcAnnoDescCumu(value);
      } 
    });

    //calc tag annotations per day cumu
    response.result.tag_annotations.map(({date, value})=>{
      let index = cumuData.findIndex(i=>i.date === date);
      if (index == -1){
        cumuData.push({date:date, value:calcAnnoTagCumu(value)});
      } else {
        cumuData[index].value += calcAnnoTagCumu(value);
      } 
    });

    //split xData, yData for chart
    let _chartDataX = [];
    let _chartDataY = [];
    cumuData.map(({date, value})=>{
      _chartDataX.push(date.split("-")[2] || "");
      _chartDataY.push(value);
    });

    //remove duplicate date
    _chartDataX.push((Number(_chartDataX[_chartDataX.length - 1]) + 1).toString());
    let xData = [];
    _chartDataX.map((value, index)=>{
      if(index == 0){
        xData.push(value);
      } else if(index == _chartDataX.length - 1){
        xData.push(value);
      }else{
        if(_chartDataX.indexOf(value) === index) {
          xData.push(value);
        }else{
          xData.push("");
        }
      }
    });
    
    //chart dataset
    const chartDataClone = {...curCumuChartdata};
    chartDataClone.datasets[0].data = _chartDataY;
    chartDataClone.labels = xData;
    setCurCumuChartdata(chartDataClone);
  }

  // uploads | annotation | verifcation chart
  const updateChart = (chartType)=>{

    let _chartDataX = [];
    let _chartDataY = [];

    if (chartType == 'uploads') {
      _arr_uploads.map(({date, value})=>{
        _chartDataX.push(date);
        _chartDataY.push(value);
      });
      setGraphTitle("UPLOAD");
    } else if (chartType == "annotations") {
      _arr_annotations.map(({date, value})=>{
        _chartDataX.push(date);
        _chartDataY.push(value);
      });
      setGraphTitle("ANNOTATION");
    } else if (chartType == "verifications") {
      _arr_verifications.map(({date, value})=>{
        _chartDataX.push(date);
        _chartDataY.push(value);
      });
      setGraphTitle("VERIFICATION");
    }
    if(_chartDataX.length == 0) {
      _chartDataX.push(new Date().toISOString().replace(/T.*/, '').split('-')[0]);
    } 

    _chartDataX.push((Number(_chartDataX[_chartDataX.length - 1]) + 1).toString());
    let xData = [];
    _chartDataX.map((value, index)=>{
      if(index == 0){
        xData.push(value);
      } else if(index == _chartDataX.length - 1){
        xData.push(value);
      }else{
        if(_chartDataX.indexOf(value) === index) {
          xData.push(value);
        }else{
          xData.push("");
        }
      }
    });

    //chart dataset
    const chartDataClone = {...curChartdata};
    chartDataClone.datasets[0].data = _chartDataY.length == 0 ? [0]: _chartDataY;
    chartDataClone.labels = xData;
    setCurChartdata(chartDataClone);
    setCurChartState(chartType);

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
        let sum_anno_description = 0;
        let sum_anno_tags = 0;
        let sum_anno = 0;

        _arr_uploads = [];
        _arr_annotations = [];
        _arr_verifications = [];

        //retrieve total sumup
        sum_anno_tags += response.result.tag_annotations.reduce((total, item) => total + Number(item.value), 0);
        sum_anno_description += response.result.text_annotations.reduce((total, item) => total + Number(item.value), 0);
        sum_anno = sum_anno_tags + sum_anno_description;
        let sum_upload = 0;
        sum_upload += response.result.uploads.reduce((total, item) => total + Number(item.value), 0);
        let sum_verification = 0;
        sum_verification += response.result.verifications.reduce((total, item) => total + Number(item.value), 0);


        //collect chart data
        response.result.uploads.map(({date, value})=>{
          _arr_uploads.push({date:(date.split("-")[2] || ""), value:value});
        });

        response.result.verifications.map(({date, value})=>{
          _arr_verifications.push({date:(date.split("-")[2] || ""), value:value});
        });

        let _total_annotations = [...response.result.text_annotations];

        response.result.tag_annotations
        .map(({date, value})=>{
          let index = _total_annotations.findIndex(i=>i.date === date);
          if (index == -1){
            _total_annotations.push({date:date, value:value});
          } else {
            _total_annotations[index].value += value;
          } 
        });

        _total_annotations
        .map(({date, value})=>{
          _arr_annotations.push({date:(date.split("-")[2] || ""), value:value});
        });

        _arr_annotations.sort((a, b) =>{
          return Number(a.date) < Number(b.date) 
        });

        setAnnotations(sum_anno);
        setUploads(sum_upload);
        setVerifications(sum_verification);

        let upload_rra = calcUploadsCumu(sum_upload);
        let anno_rra = calcAnnoDescCumu(sum_anno_description) + calcAnnoTagCumu(sum_anno_tags);
        let veri_rra = calcVeriCumu(sum_verification);

        setUploadsQuicrra(Number(upload_rra.toFixed(8)));
        setAnnotationsQuicrra(Number(anno_rra.toFixed(8)));
        setVerificationsQuicrra(Number(veri_rra.toFixed(8)));
        setCumuQuicrra(Number((upload_rra + anno_rra + veri_rra).toFixed(8)));

        updateChart('uploads');
        sumCumuData(response);
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
            <Text style={styles.graphTitle}>CUMULATIVE {graphTitle} COUNT</Text>
            <LineChart
              fromZero
              transparent
              height={200}
              yAxisSuffix=""
              style={styles.graph}
              withVerticalLines={false}
              width={Dimensions.get('window').width}
              data={curChartdata}
              chartConfig={{
                decimalPlaces: 0,
                fillShadowGradientOpacity: 1,
                fillShadowGradient: '#a5c4f8',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            {(curChartState != "uploads") &&
              <View style={styles.buttonInnerContainer}>
                <Button
                  color="#F5F6FC"
                  title="UPLOADS"
                  buttonStyle={{
                    borderRadius: 25,
                    width: '70%',
                    alignSelf: 'center',
                  }}
                  onPress={()=> updateChart('uploads')}
                  textStyle={{
                    color: '#41474E',
                    fontSize: 11,
                    fontWeight: '600',
                    fontFamily: 'Inter-Bold',
                  }}
                />
              </View>
            }
            {(curChartState != "annotations") &&
              <View style={styles.buttonInnerContainer}>
                <Button
                    color="#F5F6FC"
                    title="ANNOTATIONS"
                    buttonStyle={{
                      borderRadius: 25,
                      width: '70%',
                      alignSelf: 'center',
                    }}
                    onPress={()=> updateChart('annotations')}
                    textStyle={{
                      color: '#41474E',
                      fontSize: 11,
                      fontWeight: '600',
                      fontFamily: 'Inter-Bold',
                    }}
                  />
              </View>
            }
            {(curChartState != "verifications") &&
              <View style={styles.buttonInnerContainer}>
                <Button
                  color="#F5F6FC"
                    title="VERIFICATIONS"
                    buttonStyle={{
                      borderRadius: 25,
                      width: '70%',
                      alignSelf: 'center',
                    }}
                    onPress={()=> updateChart('verifications')}
                    textStyle={{
                      color: '#41474E',
                      fontSize: 11,
                      fontWeight: '600',
                      fontFamily: 'Inter-Bold',
                    }}
                  />
              </View>
            }
          </View>
          <View style={styles.graphContainer}>
            <Text style={styles.graphTitle}>CUMULATIVE EARNINGS</Text>
            <Text style={styles.miniBoxFooter}>QUICRRA-0</Text>
            <LineChart
              fromZero
              transparent
              height={200}
              yAxisSuffix=""
              style={styles.graph}
              withVerticalLines={false}
              width={Dimensions.get('window').width}
              data={curCumuChartdata}
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
  buttonContainer: {
    marginBottom: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonInnerContainer: {
  },

});
