<template>
  <div class="col-md-12 mb-5">
    <b-form-select v-model="filter" class="mt-2" :options="options" @change="getUsersListByFilter()"/>
    <b-table
      responsive
      striped
      :fields="neededFields"
      :items="form.results"
      :current-page="form.currentPage"
      :per-page="form.perPage"
      :busy="isBusy"
      @row-selected="rowSelected"
    >
      <template slot="Accept/Decline" slot-scope="row">
        <i
          v-if="filter === '/users?filter[activityRole][]=1'"
          class="ml-4 far fa-check-circle mouse-type-pointer"
          @click="acceptApplicant(row.item.id)"
        />
        
        <i
          v-if="filter === '/users?filter[activityRole][]=1'"
          class="ml-4 fas fa-times mouse-type-pointer"
          @click="declineApplicant(row.item.id)"
        />
  
        <i
          v-if="filter === '/users?filter[activityRole][]=2'"
          class="fas fa-star-half-alt mouse-type-pointer"
          
          @click="$bvModal.show('bv-modal-example'), clicked = row.item.id"
        />
  
        <b-modal v-if="clicked === row.item.id" id="bv-modal-example" ref="my-modal">
          <template slot="modal-title">
            Send your feedback for <b>{{ row.item.username }}</b>
          </template>
          <div class="d-block">
            <b-form-group>
              <label class="typo__label ml-3">Rate user:</label>
  
              <vue-stars v-model="feedback.stars" name="starsFeedback" :max="5" class="row ml-3">
                <img slot="activeLabel" src="../../assets/images/error_bee.png" height="17" width="17">
               
                <span slot="inactiveLabel">🙁</span>
              </vue-stars>
              <label class="typo__label ml-3">Write your comment:</label>
        
              <b-form-textarea
                id="textarea"
                v-model="feedback.comment"
                placeholder="Enter your feedback..."
                rows="3"
                max-rows="6"
              />
            </b-form-group>
          </div>
          <template slot="modal-footer" slot-scope="{ ok, cancel }">
            <b-button size="sm" variant="danger" @click="cancel()">
              Cancel
            </b-button>
            
            <b-button size="sm" variant="success" @click="setFeedback(row.item.id)">
              Send
            </b-button>
          </template>
        </b-modal>

        <i class="ml-4 fas fa-info-circle mouse-type-pointer" @click="row.toggleDetails"/>
      </template>
      
      <template slot="seniority" slot-scope="row">
        <p v-if="row.item.seniority === 0">Junior</p>
        
        <p v-else-if="row.item.seniority === 1">Middle</p>
        
        <p v-else-if="row.item.seniority === 2">Senior</p>
      </template>
      
      <template slot="row-details" slot-scope="row">
        <b-card class="border-info" @click="row.toggleDetails">
          <div class="row col-md-12">
            Technologies:
            <div v-for="(myTechnology, comas) in row.item.technologies" :key="myTechnology">
              <div class="row ml-3">{{ myTechnology.name }}
                <p v-if="comas+1 < row.item.technologies.length">, &nbsp;
                </p>
              </div>
            </div>
          </div>
          
          <div class="row col-md-12">
            <div class="row col-md-12">
              Email : <p>{{ row.item.email }}</p>
            </div>
            
            <div class="row col-md-12">
              Rating: <i v-for="star in row.item.stars" :key="star" class="fas fa-star ml-1"/>
            </div>
          </div>
        </b-card>
      </template>
  
      <div slot="table-busy" class="text-center text-danger my-2">
        <b-spinner class="align-middle"/>
        
        <strong>Loading...
        </strong>
      </div>
    </b-table>
    <div class="row col-md-12">
      <b-row class="mx-auto">
        <b-col md="12" class="my-1">
          <b-pagination
            v-model="form.currentPage"
            :total-rows="form.numResults"
            :per-page="form.perPage"
            class="my-0"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import ActivityService from '../../services/activityApi';
  import feedbackMethods from "../../services/feedback";

  export default {
    data() {
      return {
        neededFields: [
          { key: 'username', sortable: true },
          { key: 'name', sortable: true },
          { key: 'surname', sortable: true },
          { key: 'location', sortable: true },
          { key: 'position', sortable: true },
          { key: 'seniority', sortable: true},
          { key: 'Accept/Decline' }
        ],
        isBusy: true,
        form: {
          results: [
            { technologies: [] },
            { stars: null }
          ]
        },
        feedback:{
          stars: null,
          comment: ''
        },
        filter: '/users',
        options:[
          {value: '/users', text:'All users are selected'},
          {value:  '/users?filter[activityRole][]=0', text: 'Invited users'},
          {value: '/users?filter[activityRole][]=1', text: 'Applied users'},
          {value: '/users?filter[activityRole][]=2', text: 'Assigned users'},
          {value: '/users?filter[activityRole][]=3', text: 'Declined users'},
          {value: '/users?filter[activityRole][]=4', text: 'Rejected users'}
        ],
        clicked: null
      }
    },
    mounted() {
      this.getUsersListByFilter();
    },
    methods: {
      redirectToActivityApplicants() {
        this.$router.push({ name: 'applicantsList', params: { idActivity: id } });
      },
      rowSelected(row) {
        row.toggleDetails()
      },
      getUsersListByFilter() {
        ActivityService.getUsersListByFilter(this.$route.params.idActivity, this.filter).then(
          response => {
            this.form = response.data;
            this.form.results = response.data.results;
            this.isBusy = false;
            this.form.perPage = 6;
            this.form.numPages = this.form.numResults / this.form.perPage
          }
        )
      },
      acceptApplicant(applicantId) {
        ActivityService.acceptApplicants(this.$route.params.idActivity, applicantId)
          .then(() => {
            this.$toast.open({
              message: 'User successful accepted',
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true
            });
              this.getUsersListByFilter()
          })
          .catch(error => {
            this.$toast.open({
              message: error.message,
              type: 'error',
              position: 'top-right',
              duration: 3000,
              dismissible: true
            })
          })
      },
      declineApplicant(applicantId) {
        ActivityService.declineApplicants(
          this.$route.params.idActivity,
          applicantId
        )
          .then(() => {
            this.$toast.open({
              message: 'User successful declined',
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true
            });
            this.getUsersListByFilter()
          })
          .catch(response => {
            this.$toast.open({
              message: response.message,
              type: 'error',
              position: 'top-right',
              duration: 3000,
              dismissible: true
            })
          })
      },
      setFeedback(userId){
        feedbackMethods.sendFeedback(this.$route.params.idActivity, userId, this.feedback)
          .then(() => {
            this.$toast.open({
              message: 'User successful declined',
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true
            });
            this.getUsersListByFilter()
          })
          .catch(response => {
            this.$toast.open({
              message: response.error.message,
              type: 'error',
              position: 'top-right',
              duration: 3000,
              dismissible: true
            })
          })
      }
    }
  }
</script>
