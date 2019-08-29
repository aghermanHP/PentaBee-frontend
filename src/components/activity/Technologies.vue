<template>
  <b-form-group>
    <label class="typo__label ml-3 text-color-activity">Technologies:</label>
    <multiselect
      v-model="technologies"
      placeholder="Search a technology"
      label="name"
      track-by="id"
      :options="formTechnologies"
      :multiple="true"
      :taggable="true"
      @input="updateTechnologies($event)"
    />
  </b-form-group>
</template>

<script>
  import UserApi from '@/services/userDetailsApi';

  export default {
    model: {
      prop: 'technologies',
      event: 'changeTechnologiesList'
    },
    props: { technologies: Array()},
    data() {
      return {
        formTechnologies: [],
        selectedTechnologies: []
      }
    },
    mounted() {
      this.selectedTechnologies = this.technologies;
      UserApi.getTechnologies()
        .then((response) => {
        this.formTechnologies = response.data;
      })
    },
    methods: {
      updateTechnologies(technologies) {
        this.$emit('changeTechnologiesList', technologies);
      }
    }
  }
</script>
