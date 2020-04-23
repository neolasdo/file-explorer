export default {
  UPDATE_CLIPBOARD(state, payload) {
    state.clipboard.files = payload.files
    state.clipboard.folders = payload.folders
  },
  CLEAR_CLIPBOARD(state) {
    state.clipboard = {
      files: [],
      folders: []
    }
  },
  LOADING(state) {
    state.isLoading = true;
  },
  UNLOADING(state) {
    state.isLoading = false;
  },
  UPDATE_LIST(state, payload) {
    state.list = payload
  },
  UPDATE_CURRENT(state, payload) {
    if (payload && payload.id) {
      state.current.id = payload.id
      state.current.name = payload.name
    } else {
      state.current = {
        name: '',
        id: ''
      };
    }
  },
  UPDATE_BREADCRUMB(state, payload) {
    console.log(payload)
    if (payload && payload.id) {
      let index = state.breadcrumb.findIndex(item => {
        return item.id === payload.id
      })
      if (index !== -1) {
        state.breadcrumb.splice(index + 1)
      } else {
        state.breadcrumb.push({
          text: payload.name,
          id: payload.id
        })
      }
    } else {
      state.breadcrumb = [
        {
          text: 'Home',
          id: ''
        }
      ]
    }
  }
}
