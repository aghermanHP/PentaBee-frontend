import API from './';
import { userEndpoints} from '@/constants/apiEndpoints';


export default {
  sendFeedback(activityId, userId, data){
    return API.post(userEndpoints.FEEDBACK +'/' + activityId + '/' + userId, data)
  },
  editFeedback(feedbackId){
    return API.post(userEndpoints.FEEDBACK + '/' + feedbackId + '/edit')
  },
  getFeedback(feedbackId){
    return API.get(userEndpoints.FEEDBACK + '/' + feedbackId)
  }
};
