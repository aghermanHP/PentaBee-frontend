<template>
  <div :style="{'margin-left':`${depth * 20}px`}" class="node">
    <hr v-if="depth===0" class="line-comments-height">
    
    <div v-if="depth >= 1" class="row mt-2 ml-3 mr-5 mb-2 comments-field-background">
      <div class="row col-md-12 ml-2 mt-4">
        <img
          v-if="nodes.user.avatar"
          :src="backImage + '/' + nodes.user.avatar['40x40']"
          class="mt-1 ml-2 rounded-circle col-auto"
          width="40px"
          height="40px"
        >
        
        <img v-else :src="'/img/person1.png'" height="40px" width="40px" class="mt-1 ml-2 rounded-circle col-auto">
        
        <span class="col-auto">
          <p>{{ nodes.user.name + ' ' + nodes.user.surname }}:&numsp; {{ nodes.created_at | formatDateTime }}</p>
          
          <p>{{ nodes.comment }}</p>
          
          <p v-if="nodes.children.length > 0" class="deadline" @click="expanded = !expanded">
            Replies: {{ nodes.children.length }}
          </p>
        </span>
      </div>
      
      <div class="row col-md-12 ml-5 justify-content-left">
        <i class="fas fa-reply-all mt-2 ml-2" @click="clickedComment = nodes.id, replyComments = !replyComments"/>
  
        <i
          v-if="nodes.user.id === userId"
          class="fas fa-edit mt-2 ml-2"
          @click="clickedComment = nodes.id, editComments = !editComments"
        />
        
        <i v-if="nodes.user.id === userId"
           class="fas fa-trash-alt mt-2 ml-2 mr-2"
           @click="deleteComment(nodes.id)"
        />
        
        <i v-if="nodes.children.length > 0" class="far fa-caret-square-down mt-2 ml-2" @click="expanded = !expanded"/>
      </div>
      
      <div
        v-if="clickedComment === nodes.id && replyComments === true"
        class="mt-3 row col-md-12 mb-3"
      >
        <p class="mx-auto">Reply</p>
        <write-comment :parent-id="nodes.id" @isCommented="sendReloadCommentsEvent()"/>
      </div>
      
      <div
        v-if="clickedComment === nodes.id && editComments === true"
        class="mt-3 row col-md-12 mb-3"
      >
        <p class="mx-auto">Edit</p>
        <edit-comment :id-to-edit="nodes.id" :comment-message="nodes.comment" @CommentEdited="sendReloadCommentsEvent()"/>
      </div>
    </div>
    <div v-if="expanded || depth === 0 ">
      <replied-comments
        v-for="child in nodes.children"
        :key="child.id"
        :nodes="child"
        :depth="depth + 1"
      />
    </div>
  
  </div>
</template>

<script>
  import WriteComment from './WriteComment';
  import ActivityService from '../../services/activityApi';
  import EditComment from './EditComment';
  import { basePath } from "../../constants/apiEndpoints";
  import { mapGetters } from 'vuex';

  export default {
    name: 'RepliedComments',
    components:{
      WriteComment: WriteComment,
      EditComment: EditComment
    },
    props: {
      nodes: Object(null),
      depth: {
        type: Number,
        default: 0
      }
    },
    data: () => ({
      backImage: basePath,
      reply: false,
      expanded: false,
      clickedComment: Number,
      editComments: false,
      replyComments: false
    }),

    computed: {
      ...mapGetters('account', ['userId']),
    },
    methods: {
      sendReloadCommentsEvent() {
        this.$root.$emit('isReplied');
      },
      deleteComment(commentId) {
        ActivityService.deleteComment(commentId)
          .then(responses => {
            this.$toast.open({
              message: responses.data.message,
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true
            });
            this.sendReloadCommentsEvent()
          })
      }
    }
  }
</script>
