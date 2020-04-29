<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFolder">
          <v-list-item-icon>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Open</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="showModalEdit()">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Rename</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteFolder(item)">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="showEditModal" persistent max-width="600px">
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
          <v-btn color="blue darken-1" :disabled="item.name === name" text @click="submitEditName()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  export default {
    props: {
      item: {
        type: Object,
        default: {}
      }
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
        current: state => state.document.current,
      }),
    },
    methods: {
      ...mapActions({
        getByFolder: 'document/getByFolder',
        deleteFolder: 'document/deleteFolder',
        editFolderName: 'document/editFolderName',
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
      openFolder() {
        this.getByFolder(this.item)
      },
      showModalEdit() {
        this.showEditModal = true
        this.name = this.item.name
      },
      submitEditName() {
        this.editFolderName({item: this.item, name: name})
      },
      delete() {
        this.deleteFolder(this.item).then((res) => {
        })
        this.getByFolder(this.current)
      }
    }
  }
</script>
