<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFormModal">
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
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'DocumentContextMenu',
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
      }
    },
    methods: {
      ...mapActions({
        createFolder: 'document/createFolder',
        editFolder: 'document/editFolder',
        editFile: 'document/editFile',
        resetSelectedFiles: 'document/resetSelectedFiles',
        openUploadModal: 'document/openUploadModal',
        openFormModal: 'document/openFormModal',
      }),
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
