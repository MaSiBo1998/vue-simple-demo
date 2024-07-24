const getters = {
  deployUploadApi: state => state.api.deployUploadApi,
  databaseUploadApi: state => state.api.databaseUploadApi,
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  user: state => state.user.user,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
