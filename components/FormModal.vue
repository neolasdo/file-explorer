<template>
  <v-dialog v-model="showFormModal" persistent max-width="600px">
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
        <v-btn color="blue darken-1" text @click="hideFormModal">Close</v-btn>
        <v-btn color="blue darken-1" :disabled="oldName === name" text @click="submitForm()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  let formTypes = {
    createFolder: 0,
    editFolder: 1,
    editFile: 2,
  }

  export default {
    name: 'FormModal',
    data() {
      return {
        name: '',
        oldName: '',
        formType: formTypes.createFolder
      }
    },
    computed: {
      ...mapState({
        selectedFiles: state => state.document.selectedFiles,
        selectedFolder: state => state.document.selectedFolder,
        current: state => state.document.current,
        showFormModal: state => state.document.showFormModal,
        formCreate: state => state.document.formCreate,
      }),
    },
    methods: {
      ...mapActions({
        openUploadModal: 'document/openUploadModal',
        hideFormModal: 'document/hideFormModal',
        createFolder: 'document/createFolder',
        editFolderName: 'document/editFolderName',
        editFile: 'document/editFile',
      }),
      submitForm() {
        if (this.formType === formTypes.createFolder) {
          this.createFolder()
        } else if (this.formType === formTypes.editFolder) {
          this.editFolderName()
        } else if (this.formType === formTypes.editFile) {
          this.editFile()
        }
      },
    },
    watch: {
      showFormModal(val, oldVal) {
        if (val) {
          if (this.formCreate) {
            this.name = ''
            this.formType = formTypes.createFolder
          } else if (this.selectedFolder.hasOwnProperty('name')) {
            this.formType = formTypes.editFolder
            this.name = this.selectedFolder.name
          } else if (this.selectedFiles.length === 1) {
            this.name = this.selectedFiles[0].name
            this.formType = formTypes.editFile
          }
          this.oldName = this.name
        }
      }
    }
  }
</script>

