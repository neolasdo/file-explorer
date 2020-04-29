<template>
  <div>
    <file-upload-modal ref="uploadModal"></file-upload-modal>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="showCreateModal">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New folder</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openUploadModal">
          <v-list-item-icon>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Upload</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
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
          <v-btn color="blue darken-1" text @click="showFormModal = false">Close</v-btn>
          <v-btn color="blue darken-1" :disabled="name === ''" text @click="createFolder()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import FileUploadModal from "./FileUploadModal";

  export default {
    name: 'DocumentContextMenu',
    components: {
      'file-upload-modal': FileUploadModal,
    },
    computed: {
      ...mapState({
        selectedItems: state => state.document.selectedItems,
        current: state => state.document.current,
      }),
    },
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
        name: '',
        showFormModal: false
      }
    },
    methods: {
      ...mapActions({
        createFolder: 'document/createFolder',
        editFolder: 'document/editFolder',
        editFile: 'document/editFile',
        resetSelectedFiles: 'document/resetSelectedFiles',
      }),
      openUploadModal() {
        this.$refs.uploadModal.showModal();
      },
      showCreateModal() {
        this.name = '';
        this.showFormModal = true;
      },
      showContextMenu(e) {
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.resetSelectedFiles()
        this.$nextTick(() => {
          this.showMenu = true;
        });
      },
      hideContextMenu() {
        this.showMenu = false;
      }
    }
  }
</script>
