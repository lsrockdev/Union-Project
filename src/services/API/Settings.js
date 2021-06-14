export const settings = {
  baseUrl: 'http://206.81.26.71:8081',
  taxonomy: {
    getImages: '/api/v1/taxonomy/data',
    storeUserResponse: '/api/v1/taxonomy/store',
    getImage: '/api/v1/taxonomy/image?image_id=$[image_id]',
    overall: '/api/v1/stats/overall?start_date=$[start_date]&end_date=$[end_date]',
    userStats: '/api/v1/stats/user?start_date=$[start_date]&end_date=$[end_date]',
  },
  //Authentification
  auth: {
    refreshToken: '/refresh',
    login: '/login',
    logout: '/logout',
    get_nounce: '/get-nonce?public_address=$[public_address]',
    register: '/register'
  }
};
