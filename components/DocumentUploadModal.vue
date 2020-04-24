<template>
    <v-row justify="center">
        <v-dialog v-model="showDialog" persistent>
            <v-card>
                <v-card-title class="primary lighten-1" tile dark>
                    <span class="headline">Upload {{ current.id !== ''? 'to '+ current.name: '' }} </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-btn @click="openAddFolder()" color="primary" tile small dark>
                            <v-icon>mdi-folder-upload</v-icon>
                            Folder
                        </v-btn>
                        <v-btn @click="openAddFiles()" color="primary" dark tile small>
                            <v-icon>mdi-file-plus</v-icon>
                            Files
                        </v-btn>
                        <input type="file" id="file" class="hidden" ref="fileUploadInputButton"
                               multiple @change="addFilesToUpload()"/>
                        <input type="file" class="hidden" ref="folderUploadInputButton"
                               webkitdirectory multiple @change="addFolderToUpload()"/>
                        <v-data-table v-if="filesToUpload.length > 0" :headers="headers" :items="filesToUpload"
                                      class="elevation-3 mt-3" :hide-default-footer="true">
                            <template v-slot:item.actions="{ item }">
                                <v-icon small @click="deleteItem(item)">mdi-delete
                                </v-icon>
                            </template>
                        </v-data-table>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-content-center">
                    <v-btn color="primary" dark tile @click="uploadAll()">Upload</v-btn>
                    <v-btn color="default" dark tile @click="closeModal()">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
  import {mapState} from 'vuex'
  import {formatSize} from "@/helpers/file";

  export default {
    name: 'UploadModal',
    data() {
      return {
        showDialog: false,
        filesToUpload: [],
        headers: [
          {text: 'File name', value: 'fileName', align: 'left', sortable: false,},
          {text: 'File size', value: 'fileSize', align: 'left', sortable: false,},
          {text: 'Actions', value: 'actions', sortable: false},
        ],
      }
    },
    methods: {
      closeModal() {
        this.filesToUpload = []
        this.showDialog = false
      },
      showModal() {
        this.showDialog = true;
      },
      uploadAll() {

      },
      openAddFiles() {
        this.$refs.fileUploadInputButton.click();
      },
      openAddFolder() {
        this.$refs.folderUploadInputButton.click();
      },
      deleteItem(item) {
        let index = this.filesToUpload.indexOf(item)
        this.filesToUpload.splice(index, 1)
      },
      addFolderToUpload() {
        for (let file of this.$refs.folderUploadInputButton.files) {
          this.filesToUpload.push(this.createFileInfo(file));
        }
      },
      addFilesToUpload() {
        for (let file of this.$refs.fileUploadInputButton.files) {
          this.filesToUpload.push(this.createFileInfo(file));
        }
      },
      createFileInfo(file) {
        return {
          file: file,
          fileName: file.name,
          fileSize: formatSize(file.size, 20971520),
          filePath: file.webkitRelativePath,
          isPublic: false,
          shareWith: []
        }
      },
    },
    computed: {
      ...mapState({
        current: state => state.document.current,
      }),
    },
  }
</script>
<style>
    .headline {
        color: #ffffff;
    }

    .hidden {
        display: none !important;
    }
</style>
