import actions from './actions'
import getters from './getters'
import mutations from './mutations'

let states = {
  list: [],
  current: {
    name: '',
    id: ''
  },
  clipboard: {
    files: [],
    folders: [],
    command: ''
  },
  selectedItem: {
    files: [],
    folders: []
  },
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
