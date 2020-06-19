var cp = require('child_process')

try {
cp.execSync("npx vscode-tmgrammar-test -s source.clove -g syntaxes/clove.tmLanguage.json -t 'tests/unit/**/*.test.clove'",
  { stdio: 'inherit' })
} catch(err) {
    console.debug(err.toString())
    process.exit(-1)
}
    //jox6652k7kqoxav3angsnkuu7rghzpfvczawqqme4fmm5ihpd7rq
