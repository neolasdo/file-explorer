import getByFolder from "../../data/files";

export default {
  async getByFolder({ state, commit, rootState }, item) {
    commit('LOADING')
    commit('UPDATE_BREADCRUMB', item);
    commit('UPDATE_CURRENT', item);
    let res = await getByFolder(item && item.id)
    commit('UPDATE_LIST', res)
    commit('UPDATE_CURRENT', res  )
    commit('UNLOADING');
  },
  clearClipBoard({ state, commit, rootState }) {
    commit('CLEAR_CLIPBOARD');
  },
  createFolder({ state, commit, rootState }, payload) {

  },
  editFolder({ state, commit, rootState }, payload) {

  },
  editFile({ state, commit, rootState }, payload) {

  },
  executeCommand({ state, commit, rootState }, payload) {
    switch (payload.command) {
      case 'move': case 'copy': {
        console.log(payload.items)
        commit('UPDATE_CLIPBOARD', payload.items);
        break;
      }
      case 'download': {
        break
      }
      case 'delete': {
        break
      }
      case 'paste': {
        commit('CLEAR_CLIPBOARD');
        break
      }
      case 'default': {
        break
      }
    }
  },
}
