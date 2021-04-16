export const settings = {
  // baseUrl: 'https://b3ffa9b58ca9.ngrok.io',
  baseUrl: 'https://aspnetclusters-25199-0.cloudclusters.net',
  user: {
    updateProfile: '/api/Users/UpdateProfile',
    verifyPhoneNumber: '/api/Users/VerifyPhoneNumber',
    verifySmsCode:
      '/api/Users/VerifySmsCode?UserId=$[user_id]&VerificationCode=$[verification_code]',
    updatePlayerId:
      '/api/Users/UpdatePlayerId?UserId=$[user_id]&PlayerId=$[player_id]',
  },
  ride: {
    getAllRides: '/api/Ride/GetAllRides?UserId=$[user_id]',
    getAllPassengerRides: '/api/Ride/getAllPassengerRides?UserId=$[user_id]',
    getRide: '/api/Ride/GetRide?RideId=$[ride_id]',
    getPassengerPostedRide:
      '/api/Ride/GetPassengerPostedRide?RideId=$[ride_id]',
    registerVehicle: '/api/Ride/RegisterVehicle',
    shareRide: '/api/Ride/CreateRide',
    postRide: '/api/Ride/PostPassengerRide',
    searchRideAsPassenger:
      '/api/Ride/SearchRideAsPassenger?UserId=$[user_id]&StartFrom=$[start_from]&EndTo=$[end_to]',
    searchRideAsRider:
      '/api/Ride/SearchRideAsRider?UserId=$[user_id]&StartFrom=$[start_from]&EndTo=$[end_to]',
    getAllVehicles: '/api/Ride/GetAllVehicles?UserId=$[user_id]',
    requestRide:
      '/api/Ride/RequestRide?PassengerId=$[user_id]&TripId=$[trip_id]&Seats=$[seats]',
    acceptRequest:
      '/api/Ride/AcceptJoinRequest?RideId=$[ride_id]&UserId=$[user_id]',
    rejectRequest:
      '/api/Ride/RejectJoinRequest?RideId=$[ride_id]&UserId=$[user_id]',
    startTrip: '/api/Ride/StartTrip?RideId=$[ride_id]',
    endTrip: '/api/Ride/EndTrip?RideId=$[ride_id]',
    cancelTrip: '/api/Ride/CancelTrip?RideId=$[ride_id]',
    cancelBooking:
      '/api/Ride/CancelBooking?RideId=$[ride_id]&PassengerId=$[passenger_id]',
    getMatchedRides:
      '/api/Ride/GetMatchedRides?RiderId=$[rider_id]&PassengerPostedTripId=$[ppt_id]',
    requestToJoinRide:
      '/api/Ride/RequestToJoinRide?RideId=$[ride_id]&PassengerPostedTripId=$[ppt_id]',
    acceptRiderJoinRequest:
      '/api/Ride/AcceptRiderJoinRequest?RideId=$[ride_id]&PassengerPostedTripId=$[ppt_id]',
    rejectRiderJoinRequest:
      '/api/Ride/RejectRiderJoinRequest?RideId=$[ride_id]&PassengerPostedTripId=$[ppt_id]',
  },
  message: {
    getChat:
      '/api/Messages/GetChat?SenderId=$[sender_id]&ReceiverId=$[receiver_id]',
    getChatById: '/api/Messages/GetChatById?ChatId=$[chat_id]',
    sendMessage: '/api/Messages/SendMessage',
  },
};
