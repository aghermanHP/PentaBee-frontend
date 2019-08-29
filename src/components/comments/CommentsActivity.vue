<template>
  <div class="comments-component">
    <div class="border-comments-field">
      <write-comment class="row ml-4 mt-4" @isCommented="getCommentsActivity"/>
      
      <p class="ml-4 mt-2">{{ comments.length }} &numsp; comments</p>
      
      <replied-comments :nodes="commentsShow" @isDeletedComment="getCommentsActivity"/>
    </div>
  </div>
</template>

<script>
  import ActivityService from '../../services/activityApi';
  import WriteComment from './WriteComment';
  import RepliedComments from './repliedComments';

  export default {
    components:{
      WriteComment: WriteComment,
      RepliedComments: RepliedComments
    },
    data(){
      return{
      comments:[
        {
          user:{},
          created_at: 1232343545,
          updated_at: 4234324234
        }
      ],
        commentToEdit: null,
        commentsShow: {
          comment: 'Children Component',
          children: []
        }
      }
    },
    created(){
      this.$root.$on('isReplied', this.getCommentsActivity)
    },
    mounted(){
      this.getCommentsActivity()
    },
    methods:{
      getCommentsActivity(){
        this.commentsShow= {
          comment: 'Children Component',
            children: []
        };
        ActivityService.getComments(this.$route.params.activityId).then(response =>{
        this.comments = response.data;
          this.makeTree(this.comments);
        })
      },
      makeTree(list){
        let map = {}, node, i;
        for (i = 0; i < list.length; i += 1) {
          map[list[i].id] = i;
          list[i].children = [];
        }
        for (i = 0; i < list.length; i += 1) {
          node = list[i];
          if (node.parent !== null) {
            list[map[node.parent]].children.push(node);
          } else {
            this.commentsShow.children.push(node);
          }
        }
        console.log(this.commentsShow);
        return this.commentsShow.children;
      }
    }
  }
</script>
