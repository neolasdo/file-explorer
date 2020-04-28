<template>
  <v-card class="mt-3">
    <document-toolbar/>
    <v-container class="pa-0">
      <v-row no-gutters>
        <v-col cols="6">
          <v-breadcrumbs :items="formattedBreadcrumb" class="pa-3 custom-breadcrumb">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :href="'#'" @click="openFolder(item)" :disabled="item.disabled">
                {{ item.text.toUpperCase() }}
              </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </v-col>
        <v-col cols="6" class="pa-2 text-right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon small dark active-class="active" v-on="on" :color="showDetail ? 'primary': 'secondary'" @click="showDetail = !showDetail">
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
            </template>
            <span v-if="showDetail">Click to hide detail</span>
            <span v-if="!showDetail">Click to show detail</span>
          </v-tooltip>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on" light class="ml-2" tile>
                アクション <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="">
                <v-list-item-title>署名依頼</v-list-item-title>
              </v-list-item>
              <v-list-item @click="">
                <v-list-item-title>承認依頼</v-list-item-title>
              </v-list-item>
              <v-list-item @click="">
                <v-list-item-title>ダウンロード</v-list-item-title>
              </v-list-item>
              <v-list-item @click="">
                <v-list-item-title>削除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>

    <v-container style="background-color: #e0e0e0">
      <v-row>
        <v-col :cols="showDetail ? 9: 12">
          <v-container class="file-explorer" @click="onClickContainer()" @contextmenu.prevent="showContainerMenu($event)">
            <div class="folder-section" v-if="list.children && list.children.length">
              <h4>Folders</h4>
              <v-row>
                <v-col v-for="(item, index) in list.children" :key="index" cols="3">
                  <v-hover v-slot:default="{ hover }">
                    <v-card class="pa-2 dir-card" :class="{'active': checkFolderSelected(item)}"
                            @click.stop="toggleFolderSelect(item, $event)"
                            :elevation="hover ? 8 : 4" ref="folders" tile
                            @contextmenu.prevent.stop="showMenuContextFolder(item, $event)"
                            @dblclick.stop.prevent="openFolder(item)">
                      <v-list-item dense>
                        <v-list-item-icon>
                          <v-icon large>mdi-folder</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item-content>
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
                    <v-card class="pa-2 file-card" :class="{'active': checkFileSelected(item)}" ref="files"
                            @click.stop="toggleFileSelect(item, $event)" :elevation="hover ? 8 : 4" tile
                            @dblclick.stop.prevent="executeCommand({ command: 'download', items: item})"
                            @contextmenu.prevent.stop="showMenuContextFile(item, $event)">
                      <v-list-item three-line dense>
                        <v-list-item-icon>
                          <v-icon large>mdi-file</v-icon>
                        </v-list-item-icon>
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
          <document-context-menu ref="contextMenu" :selected-items="selectedItems" @refresh="openFolder(current)"
                                 @reset-selected="resetSelected" @openFolder="openFolder($event)" @select-all="selectAll()"/>
        </v-col>
        <v-col v-if="showDetail" cols="3">
          <document-detail :selected-items="selectedItems" @close="showDetail=false"/>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <span class="pa-2 font-italic caption">Use CTRL + left mouse button click to select multiple file & folder</span>
  </v-card>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import DocumentContextMenu from "./DocumentContextMenu"
  import DocumentToolBar from './DocumentToolBar'
  import {formatSize, allFileTypes} from '@/helpers/file'
  import DocumentDetail from "./DocumentDetail";

  export default {
    name: 'DocumentList',
    components: {
      'document-context-menu': DocumentContextMenu,
      'document-detail': DocumentDetail,
      'document-toolbar' : DocumentToolBar
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
        showDetail: false,
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
      openFolder(item) {
        this.getByFolder(item)
        this.resetSelected()
      },
      formatSize(size) {
        return formatSize(size);
      },
      selectAll() {
        this.selectedItems = {
          files: this.list.files,
          folders: this.list.children
        };
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
    max-height: 500px;
    overflow-y: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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

  .file-explorer::-webkit-scrollbar {
    width: 10px;
  }

  .file-explorer::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .file-explorer::-webkit-scrollbar-thumb {
    background: #888;
  }

  .file-explorer::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
