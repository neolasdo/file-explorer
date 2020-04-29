<template>
  <file-manager></file-manager>
</template>

<script>
  import FileManager from "@/components/FileManager";
  export default {
    head() {
      return {
        title: 'Company File manager',
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
      'file-manager': FileManager
    }
  }
</script>
