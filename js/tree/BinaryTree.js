Ext.define('MJ.BinaryTreeInfo', {
    getRoot: function () { },
    getLeft: function (node) { },
    getRight: function (node) { },
    getString: function (node) { }
});

/*-----------------------------------------------------------------*/

Ext.define('MJ.BinaryTree', {
    config: {
        size: 0,
        
        root: null,
        elements: null
    },
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    add: function (element, leftElement, rightElement) {
        if (!element) return;

        var node = null;
        if (!this.root) {
            node = this.root = new MJ.BinaryTree.Node({
                element: element
            });
            this.size = 1;
        } else {
            node = this._node(element);
        }
        if (!node) return;

        if (leftElement) {
            var left = node.left;
            node.left = new MJ.BinaryTree.Node({
                element: leftElement,
                parent: node
            });
            if (!left) {
                this.size++;
            } else {
                node.left.left = left.left;
                node.left.right = left.right;
            }
        }

        if (rightElement) {
            var right = node.right;
            node.right = new MJ.BinaryTree.Node({
                element: rightElement,
                parent: node
            });
            if (!right) {
                this.size++;
            } else {
                node.right.left = right.left;
                node.right.right = right.right;
            }
        }
    },
    _node: function (element) {
        if (!element || !this.root) return null;

        var queue = [];
        queue.push(this.root);

        while (queue.length > 0) {
            var node = queue.shift();
            if (MJ.Comparator.compare(node.element, element) === 0) return node;

            if (node.left) {
                queue.push(node.left);
            }

            if (node.right) {
                queue.push(node.right);
            }
        }
    },
    remove: function(element) {
        var node = this._node(element);
        if (!node) return;

        
        this.size--;

        
        if (node.left && node.right) {
            
            var s = this.successor(node);
            node.element = s.element;
            
            node = s;
        }

        
        var replacement = node.left ? node.left : node.right;
        if (replacement) { 
            replacement.parent = node.parent;
            var isLeft = false;
            if (!node.parent) {
                this.root = replacement;
            } else if (node.parent.left === node) { 
                node.parent.left = replacement;
                isLeft = true;
            } else { 
                node.parent.right = replacement;
            }
            this.afterRemove_(replacement);
            node.left = node.right = node.parent = null;
        } else if (!node.parent) { 
            this.root = null;
            this.afterRemove_(node);
        } else { 
            var isLeft = false;
            if (node === node.parent.left) {
                node.parent.left = null;
                isLeft = true;
            } else {
                node.parent.right = null;
            }
            this.afterRemove_(node);
            node.parent = null;
        }
    },
    afterRemove_: function (node) { },
    createNode: function (element, parent) {
        return new MJ.BinaryTree.Node({
            element: element,
            parent: parent
        });
    },
    preorderNodes: function () {
        if (this.size === 0) return null;
        var eles = [];
        this._preorderNodes(this.root, eles);
        return eles;
    },
    _preorderNodes: function (node, eles) {
        if (!node) return;

        eles.push(node);
        console.log(node);
        this._preorderNodes(node.left, eles);
        this._preorderNodes(node.right, eles);
    },
    preorderElements: function () {
        if (this.size === 0) return null;
        var eles = [];
        this._preorderElements(this.root, eles);
        return eles;
    },
    _preorderElements: function (node, eles) {
        if (!node) return;

        eles.push(node.element);
        this._preorderElements(node.left, eles);
        this._preorderElements(node.right, eles);
    },
    inorderElements: function () {
        if (this.size === 0) return null;
        var eles = [];
        this._inorderElements(this.root, eles);
        return eles;
    },
    _inorderElements: function (node, eles) {
        if (!node) return;

        this._inorderElements(node.left, eles);
        eles.push(node.element);
        this._inorderElements(node.right, eles);
    },
    postorderElements: function () {
        if (this.size === 0) return null;
        var eles = [];
        this._postorderElements(this.root, eles);
        return eles;
    },
    _postorderElements: function (node, eles) {
        if (!node) return;

        this._postorderElements(node.left, eles);
        this._postorderElements(node.right, eles);
        eles.push(node.element);
    },
    levelOrderElements: function () {
        if (this.size === 0) return null;
        var eles = [];
        var queue = [];
        queue.push(this.root);

        while (queue.length > 0) {
            var node = queue.shift();
            eles.push(node.element);

            if (node.left) {
                queue.push(node.left);
            }

            if (node.right) {
                queue.push(node.right);
            }
        }
        return eles;
    },
    getLeft: function (node) {
        return node.left;
    },
    getRight: function (node) {
        return node.right;
    },
    getString: function (node) {
        return node.toString();
    },
    clear: function () {
        this.size = 0;
        this.elements = null;
        this.root = null;
    },
    predecessor: function (node) {
        if (!node) return null;

        
        if (node.left) {
            var p = node.left;
            while (p.right) {
                p = p.right;
            }
            return p;
        }

        
        while (node.parent && node === node.parent.left) {
            node = node.parent;
        }
        return node.parent;
    },
    successor: function (node) {
        if (!node) return null;

        
        if (node.right) {
            var s = node.right;
            while (s.left) {
                s = s.left;
            }
            return s;
        }

        
        while (node.parent && node === node.parent.right) {
            node = node.parent;
        }
        return node.parent;
    }
});

/*-----------------------------------------------------------------*/

Ext.define('MJ.BinaryTree.Node', {
    config: {
        left: null,
        right: null,
        parent: null,
        element: null,
        height: 1
    },
    constructor: function (cfg) {
        this.initConfig(cfg);
    },
    toString: function () {
        return this.element.toString();
    },
    isLeaf: function () {
        return !this.left && !this.right;
    },
    hasTwoChildren: function () {
        return this.left && this.right;
    },
    isLeftChild: function () {
        return this.parent && this === this.parent.left;
    },
    isRightChild: function () {
        return this.parent && this === this.parent.right;
    },
    tallerChild: function () {
        var leftHeight = this.left ? this.left.height : 0;
        var rightHeight = this.right ? this.right.height : 0;
        if (leftHeight > rightHeight) return this.left;
        if (rightHeight > leftHeight) return this.right;
        return this.isLeftChild() ? this.left : this.right;
    },
    sibling: function () {
        if (this.isLeftChild()) return this.parent.right;
        if (this.isRightChild()) return this.parent.left;
        return null;
    },
    uncle: function () {
        return this.parent ? this.parent.sibling() : null;
    }
});

/*-----------------------------------------------------------------*/