var acorn = require('acorn');
var escodegen = require('escodegen');
var fs = require('fs');
var estraverse = require('estraverse');
var astCode = fs.readFileSync('./testAstSource.js').toString('utf8');

var ast = acorn.parse(astCode);

console.log('ast json:\n', JSON.stringify(ast, null, '  '));

estraverse.traverse(ast, {
    enter: function(node, parent) {
        if (node.type == 'Literal' && node.start === 58) {
            node.value = '太大大大大大了，太可怕了';
        }
    }
})

const [, , ...args] = Array.prototype.slice.apply(process.argv);

if (args[0] === '--replace') {
    replace();
}

function replace() {
    fs.writeFile('./testAstSource-new.js', escodegen.generate(ast), {encoding: 'utf8'}, function(err) {
        if (err) {
            console.log(err);
        }
    })
}

// console.log('gen code:\n', escodegen.generate(ast));

