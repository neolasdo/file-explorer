<template>
  <div>
    <document-upload-modal ref="uploadModal"></document-upload-modal>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense>
        <v-list-item @click="preview"
                     v-if="canPreview()">
          <v-list-item-icon>
            <v-icon>mdi-eye</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Preview</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="showCreateModal"
                     v-if="selectedItems.files.length + selectedItems.folders.length === 0">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New folder</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$emit('select-all')"
                     v-if="selectedItems.files.length + selectedItems.folders.length === 0">
          <v-list-item-icon>
            <v-icon>mdi-check-all</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Select all</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openUploadModal"
                     v-if="selectedItems.files.length + selectedItems.folders.length === 0">
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
        <v-list-item @click="showEditModal()"
                     v-if="selectedItems.files.length + selectedItems.folders.length === 1">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Rename</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="download" v-if="selectedItems.files.length + selectedItems.folders.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-download</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Download</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="runCommand('move')"
                     v-if="selectedItems.files.length + selectedItems.folders.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-arrow-all</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Move</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="runCommand('copy')"
                     v-if="selectedItems.files.length + selectedItems.folders.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-content-copy</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Copy</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="runCommand('paste')"
                     v-if="(clipboard.files.length + clipboard.folders.length > 0) && ( selectedItems.files.length + selectedItems.folders.length === 0)">
          <v-list-item-icon>
            <v-icon>mdi-content-paste</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Paste</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteAll()" v-if="selectedItems.files.length + selectedItems.folders.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <document-form-modal ref="documentFormModal" @submit-success="refresh()"/>
    <document-preview-modal ref="documentPreviewModal"/>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import {canPreview} from "../helpers/file";
  import DocumentUploadModal from "./DocumentUploadModal";
  import DocumentFormModal from "./DocumentFormModal";
  import DocumentPreviewModal from './DocumentPreviewModal'

  export default {
    name: 'DocumentContextMenu',
    components: {
      'document-upload-modal': DocumentUploadModal,
      'document-form-modal': DocumentFormModal,
      'document-preview-modal': DocumentPreviewModal,
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
        this.$emit('reset-selected');
      },
      download() {
        // @TODO: add axios for create download link for all selected files and folders
        this.$emit('reset-selected');
      },
      deleteAll() {
        // @TODO: add axios for delete all selected files, folders
        this.refresh()
      },
      canPreview() {
        return this.selectedItems.files.length === 1 && this.selectedItems.folders.length === 0 && canPreview(this.selectedItems.files[0].path)
      },
      preview() {
        if (this.selectedItems.files.length === 1) {
          this.$refs.documentPreviewModal.showPreview(this.selectedItems.files[0])
        }
      },
      openUploadModal() {
        this.$refs.uploadModal.showModal();
      },
      openFolder() {
        this.$emit('openFolder', this.selectedItems.folders[0])
      },
      refresh() {
        this.$emit('refresh')
      },
      showCreateModal() {
        this.$refs.documentFormModal.showCreateFolderModal();
      },
      showEditModal() {
        if (this.selectedItems.files.length === 1) {
          this.$refs.documentFormModal.showEditFileNameModal(this.selectedItems.files[0]);
        }
        if (this.selectedItems.folders.length === 1) {
          this.$refs.documentFormModal.showEditFolderModal(this.selectedItems.folders[0]);
        }
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
