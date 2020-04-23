<template>
  <div>
    <pdf
      v-for="i in numPages"
      :key="i"
      :src="src"
      :page="i"
      style="margin-bottom: 20px"
    ></pdf>
  </div>
</template>

<script>
  import pdf from 'vue-pdf'

  export default {
    components: {
      pdf
    },
    props: {
      src: {
        type: String,
        required: true
      }
    },
    computed: {
      loadingSrc() {
        return pdf.createLoadingTask(this.src);
      }
    },
    data() {
      return {
        page: 1,
        numPages: 0,
      }
    },
    mounted() {
      this.loadingSrc.then(pdf => {
        this.numPages = pdf.numPages;
      });
    }
  }
</script>
