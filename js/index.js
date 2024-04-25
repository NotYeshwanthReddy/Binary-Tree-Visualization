Ext.define('MJ.Demo', {
    statics: {
        randomMaxCount: 20,
        randomMaxValue: 100,
        bstTree: new MJ.BST(),

        SHOW_BST: '1',

        $bstCtl: $('#bst'),

        LINK_TYPE_ELBOW: MJ.BinaryTree.GraphLayout.LINK_TYPE_ELBOW,
        LINK_TYPE_LINE: MJ.BinaryTree.GraphLayout.LINK_TYPE_LINE,
        linkType : MJ.BinaryTree.GraphLayout.LINK_TYPE_ELBOW,
    }
});

$(function () {
    initCommon();
    initBst(MJ.Demo.$bstCtl, MJ.Demo.bstTree);
    $('#modules').remove();
});

function display() {
    var $ctl = showingTreeCtl();
    var $paper = $ctl.find('.paper, .joint-paper');
    $paper.show();

    var layout = new MJ.BinaryTree.GraphLayout({
        tree: showingTree(),
        linkType: MJ.Demo.linkType,
        $paper: $paper
    }).display();

    $ctl.find('.node-count').text(layout.tree.size);
    $ctl.find('.orders select').change();
}

function linkType() {
    var linkType = MJ.Demo.LINK_TYPE_ELBOW;
    if (showingTreeCtl().find('.link-type .line').is(':checked')) {
        linkType = MJ.Demo.LINK_TYPE_LINE;
    }
    return linkType;
}

function initCommon() {
    $('#common').find('.type select').change(function () {
        MJ.Demo.$bstCtl.hide();
        showingTreeCtl().show();

        MJ.Demo.linkType = linkType();
    });
}


function initBst($bstCtl, bstTree) {
    // paper
    $bstCtl.append(clonePaper());
    var $content = $bstCtl.find('.content');
    $content.append(cloneBstInput(bstTree));
}


function showingTreeCtl() {
    var val = $('#common').find('.type select').val();
    if (val === MJ.Demo.SHOW_BT) {
        return MJ.Demo.$btCtl;
    } 
    else if (val === MJ.Demo.SHOW_BST) {
        return MJ.Demo.$bstCtl;
    } 
}

function showingTree() {
    var val = $('#common').find('.type select').val();
    if (val === MJ.Demo.SHOW_BST) {
        return MJ.Demo.bstTree;
    } 
}

function clonePaper() {
    return clone('.paper').css('left', '15px').css('top', '250px');
}

function cloneLinkType(id) {
    var $linkType = clone('.link-type');
    var name = id + '-link-type';

    var linkFn = function () {
        var oldLinkType = MJ.Demo.linkType;
        MJ.Demo.linkType = linkType();
        if (MJ.Demo.linkType === oldLinkType) return;
        if (!showingTree().getRoot()) return;

        display();
    };

    var $elbow = $linkType.find('.elbow');
    var elbowId = id + '-elbow';
    $elbow.parents('label').attr('for', elbowId);
    $elbow.attr('id', elbowId);
    $elbow.attr('name', name);
    $elbow.click(linkFn);

    var $line = $linkType.find('.line');
    var lineId = id + '-line';
    $line.parents('label').attr('for', lineId);
    $line.attr('id', lineId);
    $line.attr('name', name);
    $line.click(linkFn);
    return $linkType;
}

function cloneBstInput(bstTree) {
    var $bstInput = clone('.bst-input');
    var $textarea = $bstInput.find('.data');

    $bstInput.find('.random').click(function () {
        var count = $bstInput.find('.max-count').val();
        if (Ext.isNumeric(count)) {
            count = parseInt(count);
        } else {
            count = MJ.Demo.randomMaxCount;
        }
        var value = $bstInput.find('.max-value').val();
        if (Ext.isNumeric(value)) {
            value = parseInt(value);
        } else {
            value = MJ.Demo.randomMaxValue;
        }

        count = 1 + Math.floor(Math.random()*count);
        var nums = [];
        for (var i = 0; i < count; i++) {
            var num = null;
            while (num === null || $.inArray(num, nums) !== -1) {
                num = 1 + Math.floor(Math.random()*value)
            }
            nums.push(num);
        }
        $textarea.val(nums.join(', '));
    });

    $bstInput.find('.add').click(function () {
        var eles = $textarea.val().split(/\D+/i);
        for (var i in eles) {
            bstTree.add(parseInt(eles[i].trim()));
        }
        display();
    });

    $bstInput.find('.remove').click(function () {
        if (!bstTree.getRoot()) return;
        else {
            var eles = $textarea.val().split(/\D+/i);
            for (var i in eles) {
                bstTree.remove(parseInt(eles[i].trim()));
            }
        }
        display();
    });

    $bstInput.find('.clear').click(function () {
        if (!bstTree.getRoot()) return;

        bstTree.clear();
        display();
    });

    return $bstInput;
}

function clone(sel) {
    return $('#modules').find(sel).clone(true);
}