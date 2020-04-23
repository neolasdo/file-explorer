<template>
  <v-dialog v-model="showModal " persistent max-width="600px">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Name" v-model="name" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">Close</v-btn>
        <v-btn color="blue darken-1" text @click="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'DocumentFormModal',
    data() {
      return {
        showModal: false,
        id: '',
        name: '',
        formType: 0,
        types: {
          folder: 0,
          file: 1
        }
      }
    },
    methods: {
      closeModal() {
        this.showModal = false
      },
      submit() {
        if (this.id === '' && this.formType === this.types.folder) {
          this.createFolder();
        }
        if (this.id !== '' && this.formType === this.types.folder) {
          this.editFolder();
        }
        if (this.id !== '' && this.formType === this.types.file) {
          this.editFile();
        }
        this.$emit('submit-success')
        this.closeModal()
      },
      createFolder() {
        console.log('create folder')
      },
      editFolder() {
        console.log('edit folder')
      },
      editFile() {
        console.log('edit file')
      },
      showCreateFolderModal() {
        this.id = '';
        this.name = '';
        this.formType = this.types.folder;
        this.showModal = true
      },
      showEditFolderModal(item) {
        this.id = item.id;
        this.name = item.name;
        this.formType = this.types.folder;
        this.showModal = true
      },
      showEditFileNameModal(item) {
        this.id = item.id;
        this.name = item.name;
        this.formType = this.types.file;
        this.showModal = true
      }
    }
  }
</script>
