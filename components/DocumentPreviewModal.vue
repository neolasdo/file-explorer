<template>
  <v-dialog v-model="showModal" persistent max-width="900px">
    <v-card dark color="primary" v-if="showModal">
      <v-card-text>
        <v-container>
<!--          <pdf-preview :src="'http://localhost:3000/sample.pdf'"/>-->
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  // import PdfPreview from "./PdfPreview";
  export default {
    name: 'DocumentPreviewModal',
    components: {
      // 'pdf-preview': PdfPreview
    },
    data() {
      return {
        showModal: false,
        item: {
          name: '',
          id: '',
          path: 'http://localhost/file6',
          mime: 'document/pdf',
          size: 12512344,
          created_at: '2019-01-01'
        }
      }
    },
    methods: {
      closeModal() {
        this.showModal = false
      },
      showPreview(item) {
        this.item = item
        this.showModal = true
      }
    }
  }
</script>

