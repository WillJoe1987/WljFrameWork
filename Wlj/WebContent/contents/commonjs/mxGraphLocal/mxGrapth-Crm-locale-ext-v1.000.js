/**
 * Date : 2012-4-20
 * Version : 1.000
 * Version Describe : v1.000: 增加了mxLayoutHelper，用于返回布局对象；增加布局对象mxStarLayout：星形图布局
 * Memo : This file should be included after the file "mxclient-ie1.8.js".
 */

/**
 * 
 * @param	graph 图形对象
 * @param	radius 半径（可选参数）
 * @return	星形图布局
 */
function mxStarLayout(graph, radius){
	mxGraphLayout.call(this, graph);
	this.radius = (radius != null) ? radius: 100;
}
mxStarLayout.prototype = new mxGraphLayout();

mxStarLayout.prototype.constructor = mxStarLayout;
mxStarLayout.prototype.x0 = 0;
mxStarLayout.prototype.y0 = 0;
mxStarLayout.prototype.resetEdges = true;
mxStarLayout.prototype.disableEdgeStyle = true;
mxStarLayout.prototype.execute = function(parent){
    var model = this.graph.getModel();
    model.beginUpdate();
    try {
        var max = 0;
        var top = null;
        var left = null;
        var vertices = [];
        var childCount = model.getChildCount(parent);
        for (var i = 0; i < childCount; i++) {
            var cell = model.getChildAt(parent, i);
            if (!this.isVertexIgnored(cell)) {
                vertices.push(cell);
                var bounds = this.getVertexBounds(cell);
                if (top == null) {
                    top = bounds.y;
                } else {
                    top = Math.min(top, bounds.y);
                }
                if (left == null) {
                    left = bounds.x;
                } else {
                    left = Math.min(left, bounds.x);
                }
                max = Math.max(max, Math.max(bounds.width, bounds.height));
            } else if (!this.isEdgeIgnored(cell)) {
                if (this.resetEdges) {
                    this.graph.resetEdge(cell);
                }
                if (this.disableEdgeStyle) {
                    this.setEdgeStyleEnabled(cell, false);
                }
            }
        }
        var vertexCount = vertices.length;
        var r = Math.max(vertexCount * max / (Math.PI*2), this.radius);
        if (this.moveCircle) {
            top = this.x0;
            left = this.y0;
        }
        this.star(vertices, r, left, top);//绘制星形图
    } finally {
        model.endUpdate();
    }
};
mxStarLayout.prototype.run = function(){};
mxStarLayout.prototype.radius = null;
/**
 * 绘制星形图
 * @param vertices	节点
 * @param r			半径
 * @param left		x0
 * @param top		y0
 * 
 */
mxStarLayout.prototype.star = function(vertices, r, left, top) {
    var vertexCount = vertices.length;
    var temp = vertexCount==0?1:(vertexCount==1?1:(vertexCount-1));//星形图的外圈节点数（刨去中间节点）
    var phi = 2 * Math.PI / temp;	//根据星形图的外圈节点数确定每个节点之间相对于圆的角度
    for (var i = 0; i < vertexCount; i++) {
    	if(i!=0){
    		
	        if (this.isVertexMovable(vertices[i])) {
	            this.setVertexLocation(vertices[i], left + r + r * Math.sin((i-1) * phi), top + r + r * Math.cos((i-1) * phi));
	        }
    	}
        else{
        	if (this.isVertexMovable(vertices[i])) {
                this.setVertexLocation(vertices[i], left + r, top + r);  //节点0为圆心
            }
        }
    }
};

/**
 * 根据传入的布局名称返回布局对象
 * LAYOUT_TYPE:布局类型
 * getLayoutObject():返回布局对象
 */
var mxLayoutHelper = {
	LAYOUT_TYPE : {
		HIERARCHICAL : 1,
		CIRCLE : 2,
		COMPACT_TREE : 3,
		EDGE_LABEL : 4,
		FAST_ORGANIC : 5,
		PARALLEL_EDGE : 6,
		PARTITION : 7,
		STACK : 8,
		STAR : 9		//星形图
	},
	getLayoutObject : function(layoutType,graph){
		switch(layoutType){
			case 1 : return new mxHierarchicalLayout(graph);
			case 2 : return new mxCircleLayout(graph);
			case 3 : return new mxCompactTreeLayout(graph);
			case 4 : return new mxEdgeLabelLayout(graph);
			case 5 : return new mxFastOrganicLayout(graph);
			case 6 : return new mxParallelEdgeLayout(graph);
			case 7 : return new mxPartitionLayout(graph);
			case 8 : return new mxStackLayout(graph);
			case 9 : return new mxStarLayout(graph);
			
			default : return new mxGraphLayout(graph);
		}
	}
}