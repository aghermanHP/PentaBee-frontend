import Axios from 'axios';
import CommonServices from './CommunServices';

export default {
  getActivityDetails (id) {
    CommonServices.getToken();
    return Axios.get(CommonServices.BASE_URL+ 'activities/'+ id);
  },
  getActivityList(page){
    CommonServices.getToken();
    return Axios.get(CommonServices.BASE_URL +'/activities/all/'+ page);
  }

};
