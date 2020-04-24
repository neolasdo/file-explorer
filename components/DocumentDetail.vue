<template>
  <div class="information pa-2 pa-6" v-if="selectedItems.folders.length + selectedItems.files.length">
    <b>{{ selectedItems.folders.length + selectedItems.files.length }} items selected</b>
    <div class="file-info body-2 pt-6" v-if="selectedItems.files.length === 1 && selectedItems.folders.length === 0">
      File id: {{ selectedItems.files[0].id }}<br>
      File name: {{ selectedItems.files[0].name }}<br>
      File type: {{ selectedItems.files[0].mime }}<br>
      File size: {{ formatSize(selectedItems.files[0].size) }}<br>
      Created: {{ selectedItems.files[0].created_at }}<br>
    </div>
    <div class="folder-info body-2 pt-6" v-if="selectedItems.folders.length === 1 && selectedItems.files.length === 0">
      Folder id: {{ selectedItems.folders[0].id }}<br>
      Folder name: {{ selectedItems.folders[0].name }}<br>
    </div>
  </div>
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
    }
  }
</script>
