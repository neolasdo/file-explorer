import actions from './actions'
import getters from './getters'
import mutations from './mutations'

let states = {
  files: [],
  folders: [],
  current: {
    name: '',
    id: ''
  },
  selectedFiles: [],
  selectedFolder: {},
  breadcrumb: [
    {
      text: 'Home',
      id: ''
    }
  ],
  isLoading: false,
}
export default {
  state() {
    return states
  },
  actions: actions,
  getters: getters,
  mutations: mutations
}
