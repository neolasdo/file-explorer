<template>
  <document-list></document-list>
</template>

<script>
  import DocumentList from "@/components/DocumentList";
  export default {
    head() {
      return {
        title: 'Company document list',
        script: [
          {
            src: "https://code.jquery.com/jquery-3.1.0.js",
            type: "text/javascript"
          },
          {
            src:
              "https://code.jquery.com/ui/1.12.1/jquery-ui.js",
            type: "text/javascript"
          },
        ]
      }
    },
    components: {
      'document-list': DocumentList
    }
  }
</script>
