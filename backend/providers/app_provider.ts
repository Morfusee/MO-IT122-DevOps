export default class AppProvider {
  async boot() {
    await import('../start/extensions.js')
  }
}
