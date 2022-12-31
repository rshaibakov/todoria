import path from 'path'

export default {
  process(sourceText: string, sourcePath: string) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`
    }
  }
}
