function Forest() {
    this.owner = '森林';
}

function Tree(name, type) {
    this.name = name;
    this.type = type;
}

Tree.prototype = new Forest();
Tree.prototype.constructor = Tree;

var tree = new Tree('牡丹', '灌木');

console.log(tree.owner);