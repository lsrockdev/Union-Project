import {View, Image} from 'react-native';
import Ripple from '../components/Ripple';
import {theme} from '../services/Common/theme';
import React, {useEffect, useState} from 'react';
import {actions} from '../services/State/Reducer';
import {useStateValue} from '../services/State/State';
import GestureRecognizer from 'react-native-swipe-gestures';
import {
  getAllImages,
  getImage,
  storeUserResponse,
} from '../services/API/APIManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SwipeAI = () => {
  useEffect(() => {
    fetchImages();
  }, []);

  const [images, setImages] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImage, setMainImage] = useState(null);
  const [cutoutImage, setCutoutImage] = useState(null);
  const [, dispatch] = useStateValue();

  const fetchImages = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      const response = await getAllImages();
      if (response && response.result && response.result.length > 0) {
        if (images && images.length > 0) {
          setImages([...images, ...response.result]);
        } else {
          setImages(response.result);
          setCurrentIndex(0);
          fetchImage(response.result[0].image_id);
          fetchImage(response.result[0].cutout_images[0], false);
        }
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
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
    }
  };

  const fetchImage = async (imageId, isMainImage = true) => {
    const result = await getImage(imageId);
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(result);
    fileReaderInstance.onload = () => {
      if (isMainImage) {
        setMainImage(fileReaderInstance.result);
      } else {
        setCutoutImage(fileReaderInstance.result);
      }
    };
  };

  const onSwipe = async userResponse => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      const reqBody = {
        response: userResponse,
        image_id: images[currentIndex].image_id,
      };
      const response = await storeUserResponse(reqBody);
      if (response && response.status && response.status === 'success') {
        next(true);
      } else {
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
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
    }
  };

  const next = async (keepIndex = false) => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      let allImages = images.slice();
      if (keepIndex) {
        const allImages = images.filter(
          img => img.image_id !== images[currentIndex].image_id,
        );
        // allImages = images.filter((img, index) => index !== currentIndex);
        setImages(allImages);
      }
      const index = keepIndex ? currentIndex : currentIndex + 1;
      if (allImages && allImages.length > 0) {
        if (index < allImages.length) {
          setCurrentIndex(index);
          await fetchImage(allImages[index].image_id);
          await fetchImage(allImages[index].cutout_images[0], false);
        } else {
          const index = allImages.length - 1;
          setCurrentIndex(index);
          await fetchImage(allImages[index].image_id);
          await fetchImage(allImages[index].cutout_images[0], false);
        }
        if (allImages.length <= 5) {
          fetchImages();
        }
      } else {
        setCurrentIndex(0);
        setMainImage(null);
        setCutoutImage(null);
        fetchImages();
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
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: '2%',
        paddingTop: '5%',
        alignItems: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: theme.COLORS.WHITE,
      }}>
      <Image
        resizeMode="stretch"
        style={{height: '100%', width: 160, marginVertical: 20, flex: 0.25}}
        source={
          mainImage
            ? {
                uri: mainImage,
              }
            : require('../assets/top_image.png')
        }
      />
      <GestureRecognizer
        onSwipeLeft={() => onSwipe('NO')}
        onSwipeRight={() => onSwipe('YES')}
        style={{height: '100%', width: '100%', flex: 0.6}}>
        <Image
          resizeMode="stretch"
          style={{height: '100%', width: '100%'}}
          source={
            mainImage
              ? {
                  uri: cutoutImage,
                }
              : require('../assets/bottom_image.png')
          }
        />
      </GestureRecognizer>
      <View
        style={{
          marginTop: '5%',
          flex: 0.15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ripple
          outerStyle={{
            borderWidth: 4,
            borderRadius: 25,
            borderColor: '#F3F0F3',
            marginTop: '-5%',
            marginRight: '-1%',
          }}
          innerStyle={{padding: 7}}
          onPress={() => {}}>
          <MaterialCommunityIcon name="reload" size={20} color="#dccd96" />
        </Ripple>
        <Ripple
          outerStyle={{
            borderWidth: 6,
            borderRadius: 50,
            borderColor: '#F3F0F3',
            marginRight: '-0.5%',
          }}
          innerStyle={{padding: 10}}
          onPress={() => onSwipe('NO')}>
          <MaterialCommunityIcon name="close-thick" size={35} color="#cc1c26" />
        </Ripple>
        <Ripple
          outerStyle={{
            borderWidth: 6,
            borderRadius: 50,
            borderColor: '#F3F0F3',
            marginLeft: '-0.5%',
          }}
          innerStyle={{padding: 10}}
          onPress={() => onSwipe('YES')}>
          <MaterialCommunityIcon name="check-bold" size={35} color="#76b772" />
        </Ripple>
        <Ripple
          outerStyle={{
            borderWidth: 4,
            borderRadius: 25,
            borderColor: '#F3F0F3',
            marginTop: '-5%',
            marginLeft: '-1%',
          }}
          innerStyle={{padding: 7}}
          onPress={() => next()}>
          <MaterialIcon name="arrow-right-alt" size={20} color="#dccd96" />
        </Ripple>
      </View>
    </View>
  );
};

export default SwipeAI;
