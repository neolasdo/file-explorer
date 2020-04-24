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
    // @TODO: using axios to call create Folder api
  },
  editFolder({ state, commit, rootState }, payload) {
    // @TODO: using axios to call edit Folder name api

  },
  editFile({ state, commit, rootState }, payload) {
    // @TODO: using axios to call edit File name api

  },
  executeCommand({ state, commit, rootState }, payload) {
    switch (payload.command) {
      case 'move': case 'copy': {
        commit('UPDATE_CLIPBOARD', payload);
        break;
      }
      case 'paste': {
        let command  = state.clipboard.command;
        let folderId = state.current.id;
        console.log(command, folderId)
        // @TODO: Execute command $command (using axios run copy of move)
        commit('CLEAR_CLIPBOARD');
        break
      }
      case 'default': {
        break
      }
    }
  },
}
