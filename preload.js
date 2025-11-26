const { contextBridge, ipcRenderer } = require('electron/renderer')
const fs = require('node:fs')
const path = require('node:path')

const assetsDir = path.join(__dirname, 'assets')

contextBridge.exposeInMainWorld('assets', {
  list: (category) => {
    try {
      const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
      const candidates = [
        assetsDir,
        path.join(process.cwd(), 'assets'),
        path.join(process.resourcesPath || '', 'assets')
      ]
      let used = null
      let files = []
      for (const c of candidates) {
        if (!c) continue
        try {
          if (fs.existsSync(c)) {
            used = c
            files = fs.readdirSync(c)
            break
          }
        } catch (e) {
          // ignore and try next
        }
      }

      const filtered = files.filter(f => {
        const ext = path.extname(f).toLowerCase()
        return allowed.includes(ext) && f.toLowerCase().includes(String(category).toLowerCase())
      }).map(f => {
        if (used && used.endsWith(path.sep + 'assets')) {
          return path.posix.join('assets', f)
        }
        const abs = path.resolve(used || path.join(process.cwd(), 'assets'), f)
        return `file://${abs.replace(/\\/g, '/')}`
      })
      return filtered
    } catch (e) {
      return []
    }
  },

  debug: () => {
    const candidates = [
      assetsDir,
      path.join(process.cwd(), 'assets'),
      path.join(process.resourcesPath || '', 'assets')
    ]
    const info = { candidates, found: false, used: null }
    for (const c of candidates) {
      try {
        if (c && fs.existsSync(c)) {
          info.found = true
          info.used = c
          info.files = fs.readdirSync(c)
          break
        }
      } catch (e) {
        // ignore
      }
    }
    return info
  }
})