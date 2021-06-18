export const settings = {
  baseUrl: 'https://dev.dataunion.app:8082',
  // baseUrl: 'https://alpha.dataunion.app:4430',
  taxonomy: {
    getImages: '/api/v1/taxonomy/data',
    storeUserResponse: '/api/v1/taxonomy/store',
    getImage: '/api/v1/taxonomy/image?image_id=$[image_id]',
    getLabelImage: '/api/v1/taxonomy/label?label_id=$[label_id]',
    //overall: '/api/v1/stats/overall?start_date=$[start_date]&end_date=$[end_date]',
    overall: '/api/v1/stats/overall-graph?end_date=$[end_date]&start_date=$[start_date]',
    //userStats: '/api/v1/stats/user?start_date=$[start_date]&end_date=$[end_date]',
    userStats: '/api/v1/stats/user-graph?start_date=$[start_date]&end_date=$[end_date]',
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
