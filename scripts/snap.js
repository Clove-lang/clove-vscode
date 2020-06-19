var cp = require('child_process')

try {
cp.execSync("npx vscode-tmgrammar-snap -s source.clove -g syntaxes/clove.tmLanguage.json -t 'tests/snap/**/*.test.clove'",
  { stdio: 'inherit' })
} catch(err) {
    console.debug(err.toString())
    process.exit(-1)
}