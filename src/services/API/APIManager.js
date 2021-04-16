import {getData, putData, postData} from './CoreAPICalls';
import {settings as s} from './Settings';

export const verifyPhoneNumber = async (data) => {
  try {
    const response = await postData(s.user.verifyPhoneNumber, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const verifySmsCode = async (userId, verificationCode) => {
  try {
    const response = await postData(
      s.user.verifySmsCode
        .replace('$[user_id]', userId)
        .replace('$[verification_code]', verificationCode),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const registerVehicle = async (data) => {
  try {
    const response = await postData(s.ride.registerVehicle, data, true);
    return response;
  } catch (err) {
    return null;
  }
};

export const shareRide = async (data) => {
  try {
    const response = await postData(s.ride.shareRide, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const postPassengerRide = async (data) => {
  try {
    const response = await postData(s.ride.postRide, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await putData(s.user.updateProfile, data, true);
    return response;
  } catch (err) {
    return null;
  }
};

export const getAllRides = async (userId) => {
  try {
    const response = await getData(
      s.ride.getAllRides.replace('$[user_id]', userId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const getAllPassengerRides = async (userId) => {
  try {
    const response = await getData(
      s.ride.getAllPassengerRides.replace('$[user_id]', userId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const getRideDetails = async (rideId) => {
  try {
    const response = await getData(
      s.ride.getRide.replace('$[ride_id]', rideId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const getPassengerPostedRideDetails = async (rideId) => {
  try {
    const response = await getData(
      s.ride.getPassengerPostedRide.replace('$[ride_id]', rideId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const searchRideAsPassenger = async (
  userId,
  pickup,
  dropoff,
  tripDate,
) => {
  try {
    let url = s.ride.searchRideAsPassenger
      .replace('$[user_id]', userId)
      .replace('$[start_from]', pickup)
      .replace('$[end_to]', dropoff);
    if (tripDate) {
      url += `&TripDate=${tripDate}`;
    }
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const searchRideAsRider = async (userId, pickup, dropoff, tripDate) => {
  try {
    let url = s.ride.searchRideAsRider
      .replace('$[user_id]', userId)
      .replace('$[start_from]', pickup)
      .replace('$[end_to]', dropoff);
    if (tripDate) {
      url += `&TripDate=${tripDate}`;
    }
    const response = await getData(url);
    return response;
  } catch (err) {
    return null;
  }
};

export const getAllVehicles = async (userId) => {
  try {
    const response = await getData(
      s.ride.getAllVehicles.replace('$[user_id]', userId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const requestRide = async (userId, tripId, seats) => {
  try {
    const response = await postData(
      s.ride.requestRide
        .replace('$[user_id]', userId)
        .replace('$[trip_id]', tripId)
        .replace('$[seats]', seats),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const acceptPassengerRequest = async (rideId, passengerId) => {
  try {
    const response = await getData(
      s.ride.acceptRequest
        .replace('$[ride_id]', rideId)
        .replace('$[user_id]', passengerId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const rejectPassengerRequest = async (rideId, passengerId) => {
  try {
    const response = await getData(
      s.ride.rejectRequest
        .replace('$[ride_id]', rideId)
        .replace('$[user_id]', passengerId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const startTrip = async (rideId) => {
  try {
    const response = await getData(
      s.ride.startTrip.replace('$[ride_id]', rideId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const endTrip = async (rideId) => {
  try {
    const response = await getData(
      s.ride.endTrip.replace('$[ride_id]', rideId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const cancelTrip = async (rideId) => {
  try {
    const response = await getData(
      s.ride.cancelTrip.replace('$[ride_id]', rideId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const cancelBooking = async (rideId, passengerId) => {
  try {
    const response = await getData(
      s.ride.cancelBooking
        .replace('$[ride_id]', rideId)
        .replace('$[passenger_id]', passengerId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const getChat = async (senderId, receiverId) => {
  try {
    const response = await getData(
      s.message.getChat
        .replace('$[sender_id]', senderId)
        .replace('$[receiver_id]', receiverId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const getChatById = async (chatId) => {
  try {
    const response = await getData(
      s.message.getChatById.replace('$[chat_id]', chatId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const sendMessage = async (data) => {
  try {
    const response = await postData(s.message.sendMessage, data);
    return response;
  } catch (err) {
    return null;
  }
};

export const getMatchedRides = async (riderId, pptId) => {
  try {
    const response = await getData(
      s.ride.getMatchedRides
        .replace('$[rider_id]', riderId)
        .replace('$[ppt_id]', pptId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const requestToJoinRide = async (rideId, pptId) => {
  try {
    const response = await postData(
      s.ride.requestToJoinRide
        .replace('$[ride_id]', rideId)
        .replace('$[ppt_id]', pptId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const acceptRiderJoinRequest = async (riderId, pptId) => {
  try {
    const response = await getData(
      s.ride.acceptRiderJoinRequest
        .replace('$[ride_id]', riderId)
        .replace('$[ppt_id]', pptId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const rejectRiderJoinRequest = async (riderId, pptId) => {
  try {
    const response = await getData(
      s.ride.rejectRiderJoinRequest
        .replace('$[ride_id]', riderId)
        .replace('$[ppt_id]', pptId),
    );
    return response;
  } catch (err) {
    return null;
  }
};
