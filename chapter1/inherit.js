function Forest() {
    this.owner = '森林';
}

function Tree(name, type) {
    this.name = name;
    this.type = type;
}

// 构造函数方式继承
function Tree(name, type) {
    Forest.apply(this, arguments);
    this.name = name;
    this.type = type;
}

var tree = new Tree('松树', '乔木');
console.log(tree.owner);

//var tree = new Tree('牡丹', '灌木');
