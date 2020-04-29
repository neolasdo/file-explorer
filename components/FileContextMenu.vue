<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="preview" v-if="canPreview()">
          <v-list-item-icon>
            <v-icon>mdi-eye</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Preview</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="selectedItems.length === 1" @click="showModalEdit()">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Rename</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="download">
          <v-list-item-icon>
            <v-icon>mdi-download</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Download</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteAll()">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <file-preview-modal ref="filePreviewModal"/>

    <v-dialog v-model="showEditModal" v-if="selectedItems.length === 1" persistent max-width="600px">
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
          <v-btn color="blue darken-1" text @click="showEditModal = false">Close</v-btn>
          <v-btn color="blue darken-1" :disabled="selectedItems[0] && selectedItems[0].name === name" text
                 @click="submitEditName()">Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import {canPreview} from "../helpers/file";
  import FilePreviewModal from './FilePreviewModal'

  export default {
    name: 'FileContextMenu',
    components: {
      'file-preview-modal': FilePreviewModal
    },
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
        showEditModal: false,
        name: ''
      }
    },
    computed: {
      ...mapState({
        selectedItems: state => state.document.selectedFiles,
      }),
    },
    methods: {
      ...mapActions({
        download: 'document/download',
        deleteSelected: 'document/deleteSelected',
      }),
      showContext(e) {
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.$nextTick(() => {
          this.showMenu = true;
        });
      },
      hideContext() {
        this.showMenu = false;
      },
      showModalEdit() {
        this.showEditModal = true
        this.name = this.selectedItems[0].name
      },
      canPreview() {
        return this.selectedItems.length === 1 && canPreview(this.selectedItems[0].path)
      },
      submitEditName() {
        this.editFolderName({item: this.item, name: name})
      },
      deleteAll() {
        this.deleteSelected()
      },
      preview() {
        if (this.selectedItems.length === 1) {
          this.$refs.filePreviewModal.showPreview(this.selectedItems[0])
        }
      }
    }
  }
</script>
