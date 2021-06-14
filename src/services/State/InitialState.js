export const initialState = {
  user: {
    type: 1,
    name: 'Jon Abbas Kok',
    gender: 0,
    location: 'Paris',
    cnic: '12345-1234567-1',
    phoneNumber: '3331234567',
  },
  authInfo: {refresh_token: "", access_token: ""},
  progressSettings: {show: false, promise: null},
  alertSettings: {settings: {}, promise: null},
  showVideoCallModal: true,
  appointmentBooked: false,
  newMessage: null,
};
