<template>
  <v-card class="mt-3">
    <v-breadcrumbs :items="formattedBreadcrumb" class="pa-3 custom-breadcrumb">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="'#'" @click="getByFolder(item)" :disabled="item.disabled">
          {{ item.text.toUpperCase() }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-container class="file-explorer" @click="onClickContainer()" @contextmenu.prevent="showContainerMenu($event)">
      <div class="folder-section" v-if="list.children && list.children.length">
        <h4>Folders</h4>
        <v-row>
          <v-col v-for="(item, index) in list.children" :key="index" cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card class="pa-2 dir-card" :class="{'active': checkFolderSelected(item)}"
                      @click.stop="toggleFolderSelect(item, $event)"
                      :elevation="hover ? 8 : 4"
                      @contextmenu.prevent.stop="showMenuContextFolder(item, $event)"
                      @dblclick.stop="getByFolder(item)">
                <v-list-item dense>
                  <v-list-item-icon><v-icon large>mdi-folder</v-icon></v-list-item-icon>
                  <v-list-item-content><v-list-item-title>{{ item.name }}</v-list-item-title></v-list-item-content>
                </v-list-item>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>
      <div class="file-section" v-if="list.files && list.files.length">
        <h4>Files</h4>
        <v-row>
          <v-col v-for="(item, index) in list.files" :key="index" cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card class="pa-2 file-card" :class="{'active': checkFileSelected(item)}"
                      @click.stop="toggleFileSelect(item, $event)":elevation="hover ? 8 : 4" @dblclick.stop="executeCommand({ command: 'download', items: item})"
                      @contextmenu.prevent.stop="showMenuContextFile(item, $event)">
                <v-list-item three-line dense>
                  <v-list-item-icon><v-icon large>mdi-file</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ formatSize(item.size) }} <br> {{ item.created_at }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <document-context-menu ref="contextMenu" :selected-items="selectedItems" @refresh="getByFolder(current)"
                           @run-command="resetSelected" @openFolder="getByFolder($event)"/>
    <span class="pa-2 font-italic caption">Use CTRL + left mouse button click to select multiple file & folder</span>
  </v-card>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import DocumentContextMenu from "./DocumentContextMenu";
  import {formatSize} from '@/helpers/file'

  export default {
    name: 'DocumentList',
    components: {
      'document-context-menu': DocumentContextMenu
    },
    props: {
      employee_id: {
        type: Number,
        default: 0,
        required: false
      }
    },
    data() {
      return {
        selectedItems: {
          files: [],
          folders: []
        },
        showMenu: false,
        x: 0,
        y: 0,
      }
    },
    computed: {
      ...mapState({
        breadcrumb: state => state.document.breadcrumb,
        list: state => state.document.list,
        clipboard: state => state.document.clipboard,
        isLoading: state => state.document.isLoading,
        current: state => state.document.current,
      }),
      formattedBreadcrumb() {
        return this.breadcrumb.map(item => {
          item.disabled = item.id === this.current.id;
          return item;
        })
      },
    },
    methods: {
      ...mapActions({
        getByFolder: 'document/getByFolder',
        updateClipBoard: 'document/updateClipBoard',
        clearClipBoard: 'document/clearClipBoard',
        createFolder: 'document/createFolder',
        executeCommand: 'document/executeCommand',
      }),
      formatSize(size) {
        return formatSize(size);
      },
      resetSelected() {
        this.selectedItems = {
          files: [],
          folders: []
        };
      },
      toggleFolderSelect(item, e) {
        if (!e.ctrlKey) {
          this.resetSelected()
        }
        let index = this.selectedItems.folders.findIndex(element => {
          return element.id === item.id;
        });
        if (index !== -1) {
          this.selectedItems.folders.splice(index, 1);
        } else {
          this.selectedItems.folders.push(item);
        }
      },
      toggleFileSelect(item, e) {
        if (!e.ctrlKey) {
          this.resetSelected()
        }
        let index = this.selectedItems.files.findIndex(element => {
          return element.id === item.id;
        });
        if (index !== -1) {
          this.selectedItems.files.splice(index, 1);
        } else {
          this.selectedItems.files.push(item);
        }
      },
      checkFolderSelected(item) {
        let index = this.selectedItems.folders.findIndex(element => {
          return element.id === item.id;
        });
        return index !== -1
      },
      checkFileSelected(item) {
        let index = this.selectedItems.files.findIndex(element => {
          return element.id === item.id;
        });
        return index !== -1
      },
      showMenuContextFolder(item, e) {
        if (!this.checkFolderSelected(item)) {
          this.resetSelected()
          this.selectedItems.folders.push(item)
        }
        this.showContextMenu(e)
      },
      showMenuContextFile(item, e) {
        if (!this.checkFileSelected(item)) {
          this.resetSelected()
          this.selectedItems.files.push(item)
        }
        this.showContextMenu(e)
      },
      showContainerMenu(e) {
        this.resetSelected();
        this.showContextMenu(e)
      },
      showContextMenu(e) {
        this.$refs.contextMenu.showContextMenu(e)
      },
      onClickContainer() {
        this.$refs.contextMenu.hideContextMenu()
        this.resetSelected()
      }
    },
    beforeMount() {
      this.getByFolder()
    }
  }
</script>
<style>
  .file-explorer {
    background-color: #e0e0e0;
  }

  .v-breadcrumbs {
    border-bottom: 1px solid #ddd;
  }

  .dir-card.active, .file-card.active {
    color: #4385f4;
    background-color: #e5e5e5;
    border: 1px solid #4385f4
  }

  .dir-card:not(.active), .file-card:not(.active) {
    color: #000;
    background-color: #fff;
    border: 1px solid #fff
  }
</style>
