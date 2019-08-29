<template>
  <b-form-group>
    <label class="typo__label ml-3 text-color-activity">Types:</label>
    <multiselect
      v-model="types"
      placeholder="Search a type"
      label="name"
      track-by="id"
      :options="formTypes"
      :multiple="true"
      :taggable="true"
      @input="updateTypes($event)"
    />
  </b-form-group>
</template>

<script>
  import ActivityService from '../../services/activityApi';

  export default {
    model: {
      prop: 'types',
      event: 'changeTypesList'
    },
    props: {types: Array()},
    data() {
      return {
        formTypes: [],
        selectedTypes: []
      }
    },
    mounted() {
      this.selectedTypes = this.types;

      ActivityService.getTypes()
        .then((response) => {
          this.formTypes = response.data;
        })
    },
    methods: {
      updateTypes(types) {
        this.$emit('changeTypesList', types)
      }
    }
  }
</script>
