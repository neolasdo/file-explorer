<template>
  <document-list></document-list>
</template>

<script>
  import DocumentList from "@/components/DocumentList";
  export default {
    head() {
      return {
        title: 'Company document list'
      }
    },
    components: {
      'document-list': DocumentList
    }
  }
</script>
