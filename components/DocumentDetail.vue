<template>
  <v-card class="mx-auto pa-2" tile>
    <div class="d-flex flex-row-reverse">
      <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
    </div>
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12">
            <b>{{ selectedItems.folders.length + selectedItems.files.length }} items selected</b>
          </v-col>
          <v-col cols="12" v-if="selectedItems.files.length === 1 && selectedItems.folders.length === 0">
            File id: {{ selectedItems.files[0].id }}<br>
            File name: {{ selectedItems.files[0].name }}<br>
            File type: {{ selectedItems.files[0].mime }}<br>
            File size: {{ formatSize(selectedItems.files[0].size) }}<br>
            Created: {{ selectedItems.files[0].created_at }}<br>
          </v-col>
          <v-col cols="12" v-if="selectedItems.folders.length === 1 && selectedItems.files.length === 0">
            Folder id: {{ selectedItems.folders[0].id }}<br>
            Folder name: {{ selectedItems.folders[0].name }}<br>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import {formatSize} from '@/helpers/file'

  export default {
    name: 'DocumentDetail',
    props: {
      selectedItems: {
        type: Object,
        default: {
          files: [],
          folders: []
        }
      }
    },
    methods: {
      formatSize(size) {
        return formatSize(size);
      },
      close() {
        this.$emit('close')
      }
    }
  }
</script>
