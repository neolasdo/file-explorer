<template>
  <div>
    <document-upload-modal ref="uploadModal"></document-upload-modal>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense>
        <v-list-item @click="runCommand('preview')"
                     v-if="selectedItems.files.length === 1 && selectedItems.folders.length === 0">
          <v-list-item-icon>
            <v-icon>mdi-eye</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Preview</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="showCreateModal"
                     v-if="selectedItems.files.length === 0 && selectedItems.folders.length === 0">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New folder</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openUploadModal"
                     v-if="selectedItems.files.length === 0 && selectedItems.folders.length === 0">
          <v-list-item-icon>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Upload</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openFolder" v-if="selectedItems.files.length === 0 && selectedItems.folders.length === 1">
          <v-list-item-icon>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Open</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="showEditModal(selectedItems.files[0] || selectedItems.folders[0])"
                     v-if="selectedItems.files.length  + selectedItems.folders.length === 1">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Rename</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="runCommand('download')"
                     v-if="selectedItems.files.length > 0 || selectedItems.folders.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-download</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Download</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="runCommand('move')"
                     v-if="selectedItems.files.length > 0 || selectedItems.folders.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-arrow-all</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Move</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="runCommand('copy')"
                     v-if="selectedItems.files.length > 0 || selectedItems.folders.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-content-copy</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Copy</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="runCommand('paste')"
                     v-if="(clipboard.files && clipboard.files.length > 0) || (clipboard.folders && clipboard.folders.length > 0)">
          <v-list-item-icon>
            <v-icon>mdi-content-paste</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Paste</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="runCommand('delete')"
                     v-if="selectedItems.files.length > 0 || selectedItems.folders.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="showFormModal " persistent max-width="600px">
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
          <v-btn color="blue darken-1" text @click="closeCreateModal">Close</v-btn>
          <v-btn color="blue darken-1" text @click="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import DocumentUploadModal from "./DocumentUploadModal";

  export default {
    name: 'DocumentContextMenu',
    components: {
      'document-upload-modal': DocumentUploadModal
    },
    props: {
      selectedItems: {
        type: Object,
        default: {
          files: [],
          folders: []
        }
      },
    },
    computed: {
      ...mapState({
        clipboard: state => state.document.clipboard,
        isLoading: state => state.document.isLoading,
      }),
    },
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
        name: '',
        showFormModal : false
      }
    },
    methods: {
      ...mapActions({
        updateClipBoard: 'document/updateClipBoard',
        clearClipBoard: 'document/clearClipBoard',
        createFolder: 'document/createFolder',
        editFolder: 'document/editFolder',
        editFile: 'document/editFile',
        executeCommand: 'document/executeCommand',
      }),
      runCommand(command) {
        this.executeCommand({
          command: command,
          items: this.selectedItems
        });
        this.$emit('run-command');
      },
      openUploadModal() {
        this.$refs.uploadModal.showModal();
      },
      submit() {
        if (this.selectedItems.files.length + this.selectedItems.folders.length === 1) {
          if (this.selectedItems.files[0]) {
            this.editFile({
              id: this.selectedItems.files[0].id,
              name: this.name
            })
          }
          if (this.selectedItems.folders[0]) {
            this.editFolder({
              id: this.selectedItems.folders[0].id,
              name: this.name
            })
          }
        }
        this.createFolder({
          name: this.name
        })
        this.closeCreateModal()
      },
      openFolder() {
        this.$emit('openFolder', this.selectedItems.folders[0])
      },
      closeCreateModal() {
        this.showFormModal  = false
      },
      showCreateModal() {
        this.name = '';
        this.showFormModal  = true;
      },
      showEditModal(item) {
        this.name = item.name;
        this.showFormModal  = true;
      },
      showContextMenu(e) {
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
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
