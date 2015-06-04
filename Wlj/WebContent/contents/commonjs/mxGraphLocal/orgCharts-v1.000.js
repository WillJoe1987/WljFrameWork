	mxConstants.SHADOWCOLOR = '#C0C0C0';
function orgChartsMain(cPanel)
	{
		if(!mxClient.isBrowserSupported()){
			mxUtils.error('Browser is not supported!', 200, false);
		}
		else{
			var container = cPanel.body.dom;
			container.style.overflow = 'hidden';
			container.style.left = '0px';
			container.style.top = '0px';
			container.style.right = '0px';
			container.style.bottom = '0px';

			var outlineObject = cPanel.body.appendChild(Ext.getBody().createChild({
				tag:'div',
				style:'z-index: 1; overflow: hidden; position:absolute; float:right;top: 0px; right: 0px; width: 160px; height: 120px; background: transparent; border-style: solid; border-color: lightgray;'
			}));
			
			var outline = outlineObject.dom;
			
			mxEvent.disableContextMenu(container);

			if (mxClient.IS_IE){
				new mxDivResizer(container);
				new mxDivResizer(outline);
			}
		    if (mxClient.IS_GC || mxClient.IS_SF){
		    	container.style.background = '-webkit-gradient(linear, 0 0%, 0% 100%, from(#FFFFFF), to(#E7E7E7))';
		    }
		    else if (mxClient.IS_NS)
		    {
		    	container.style.background = '-moz-linear-gradient(top, #FFFFFF, #E7E7E7)';  
		    }
		    else if (mxClient.IS_IE)
		    {
		    	container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
		                'StartColorStr=\'#FFFFFF\', EndColorStr=\'#E7E7E7\', GradientType=0)';
		    }

			//document.body.appendChild(container);

			// Creates the graph inside the given container
			var graph = new mxGraph(container);

			// Creates the outline (navigator, overview) for moving
			// around the graph in the top, right corner of the window.
			var outln = new mxOutline(graph, outline);
			
			// Disables tooltips on touch devices
			graph.setTooltips(!mxClient.IS_TOUCH);

			// Set some stylesheet options for the visual appearance of vertices
			var style = graph.getStylesheet().getDefaultVertexStyle();
			style[mxConstants.STYLE_SHAPE] = 'label';
			
			style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
			style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
			style[mxConstants.STYLE_SPACING_LEFT] = 54;
			
			style[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
			style[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
			style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';
			
			style[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
			style[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
			style[mxConstants.STYLE_FONTSIZE] = '12';
			style[mxConstants.STYLE_FONTSTYLE] = '1';
			
			style[mxConstants.STYLE_SHADOW] = '1';
			style[mxConstants.STYLE_ROUNDED] = '1';
			style[mxConstants.STYLE_GLASS] = '1';
			
			style[mxConstants.STYLE_IMAGE] = mxClient.basePath+'/editors/images/dude3.png';
			style[mxConstants.STYLE_IMAGE_WIDTH] = '48';
			style[mxConstants.STYLE_IMAGE_HEIGHT] = '48';

			// Sets the default style for edges
			style = graph.getStylesheet().getDefaultEdgeStyle();
			style[mxConstants.STYLE_ROUNDED] = true;
			style[mxConstants.STYLE_STROKEWIDTH] = 3;
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
			
			// Enables automatic sizing for vertices after editing and
			// panning by using the left mouse button.
			graph.setCellsMovable(false);
			graph.setAutoSizeCells(true);
			graph.setPanning(true);
			graph.panningHandler.useLeftButtonForPanning = true;

			// Displays a popupmenu when the user clicks
			// on a cell (using the left mouse button) but
			// do not select the cell when the popup menu
			// is displayed
			graph.panningHandler.selectOnPopup = false;

			// Stops editing on enter or escape keypress
			var keyHandler = new mxKeyHandler(graph);

			// Changes the default style for edges and vertices "in-place"
			var style = graph.getStylesheet().getDefaultEdgeStyle();
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;

			var style = graph.getStylesheet().getDefaultVertexStyle();
			style[mxConstants.STYLE_SPACING] = 8;

			// Enables automatic layout on the graph and installs
			// a tree layout for all groups who's children are
			// being changed, added or removed.
			var layout = new mxCompactTreeLayout(graph, false);
			layout.useBoundingBox = false;
			layout.levelDistance = 40;
			layout.nodeDistance = 16;

			// Allows the layout to move cells even though cells
			// aren't movable in the graph
			layout.isVertexMovable = function(cell)
			{
				return true;
			};

			var layoutMgr = new mxLayoutManager(graph);

			layoutMgr.getLayout = function(cell)
			{
				if (cell.getChildCount() > 0)
				{
					return layout;
				}
			};

			// Installs a popupmenu handler using local function (see below).
			graph.panningHandler.factoryMethod = function(menu, cell, evt)
			{
				return createPopupMenu(graph, menu, cell, evt);
			};

			// Fix for wrong preferred size
			var oldGetPreferredSizeForCell = graph.getPreferredSizeForCell;
			graph.getPreferredSizeForCell = function(cell)
			{
				var result = oldGetPreferredSizeForCell.apply(this, arguments);

				if (result != null)
				{
					result.width = Math.max(120, result.width - 40);
				}

				return result;
			};

			// Gets the default parent for inserting new cells. This
			// is normally the first child of the root (ie. layer 0).
			var parent = graph.getDefaultParent();

			// Adds the root vertex of the tree
			graph.getModel().beginUpdate();
			try
			{
				var w = graph.container.offsetWidth;
				var v1 = graph.insertVertex(parent, 'treeRoot',
					'Organization', w/2 - 30, 20, 140, 60, 'image='+mxClient.basePath+'/editors/images/house.png');
				graph.updateCellSize(v1);

				addOverlays(graph, v1, false);
			}
			finally
			{
				// Updates the display
				graph.getModel().endUpdate();
			}

			//var content = document.createElement('div');
			//var content = cPanel.body.dom.createElement('div');
			
			
			
			var contentObject = cPanel.body.appendChild(cPanel.body.createChild({
				tag:'div',
				style:'z-index:100000'
				//style:'z-index: 1; overflow: hidden; position:absolute; float:right;top: 0px; right: 0px; width: 160px; height: 120px; background: transparent; border-style: solid; border-color: lightgray;'
			}));
			var content = contentObject.dom;
			
			content.style.padding = '4px';

			var tb = new mxToolbar(content);

			tb.addItem('Zoom In',mxClient.basePath+ '/images/zoom_in32.png',function(evt)
			{
				graph.zoomIn();
			});

			tb.addItem('Zoom Out',mxClient.basePath+ '/images/zoom_out32.png',function(evt)
			{
				graph.zoomOut();
			});
			
			tb.addItem('Actual Size',mxClient.basePath+ '/images/view_1_132.png',function(evt)
			{
				graph.zoomActual();
			});

			tb.addItem('Print', mxClient.basePath+'/images/print32.png',function(evt)
			{
				var preview = new mxPrintPreview(graph, 1);
				preview.open();
			});

			tb.addItem('Poster Print',mxClient.basePath+ '/images/press32.png',function(evt)
			{
				var pageCount = mxUtils.prompt('Enter maximum page count', '1');

				if (pageCount != null)
				{
					var scale = mxUtils.getScaleForPageCount(pageCount, graph);
					var preview = new mxPrintPreview(graph, scale);
					preview.open();
				}
			});

			wnd = new mxWindow('Tools', content, 0, 27, 200, 66, false,true);
			wnd.setMaximizable(false);
			wnd.setScrollable(false);
			wnd.setResizable(false);
			wnd.setVisible(true);
			debugger;
		}
	};
//Function to create the entries in the popupmenu
function createPopupMenu(graph, menu, cell, evt)
{
var model = graph.getModel();

if (cell != null)
{
	if (model.isVertex(cell))
	{
		menu.addItem('Add child', mxClient.basePath+'/editors/images/overlays/check.png', function()
		{
			addChild(graph, cell);
		});
	}

	menu.addItem('Edit label', mxClient.basePath+'/editors/images/text.gif', function()
	{
		graph.startEditingAtCell(cell);
	});

	if (cell.id != 'treeRoot' &&
		model.isVertex(cell))
	{
		menu.addItem('Delete', mxClient.basePath+'/editors/images/delete.gif', function()
		{
			deleteSubtree(graph, cell);
		});
	}

	menu.addSeparator();
}

menu.addItem('Fit', mxClient.basePath+'/editors/images/zoom.gif', function()
{
	graph.fit();
});

menu.addItem('Actual', mxClient.basePath+'/editors/images/zoomactual.gif', function()
{
	graph.zoomActual();
});

menu.addSeparator();

menu.addItem('Print',mxClient.basePath+ '/editors/images/print.gif', function()
{
	var preview = new mxPrintPreview(graph, 1);
	preview.open();
});

menu.addItem('Poster Print', mxClient.basePath+'/editors/images/print.gif', function()
{
	var pageCount = mxUtils.prompt('Enter maximum page count', '1');

	if (pageCount != null)
	{
		var scale = mxUtils.getScaleForPageCount(pageCount, graph);
		var preview = new mxPrintPreview(graph, scale);
		preview.open();
	}
});
};

function addOverlays(graph, cell, addDeleteIcon)
{
var overlay = new mxCellOverlay(new mxImage(mxClient.basePath+'/images/add.png', 24, 24), 'Add child');
overlay.cursor = 'hand';
overlay.align = mxConstants.ALIGN_CENTER;
overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt)
{
	addChild(graph, cell);
}));

graph.addCellOverlay(cell, overlay);

if (addDeleteIcon)
{
	overlay = new mxCellOverlay(new mxImage(mxClient.basePath+'/images/close.png', 30, 30), 'Delete');
	overlay.cursor = 'hand';
	overlay.offset = new mxPoint(-4, 8);
	overlay.align = mxConstants.ALIGN_RIGHT;
	overlay.verticalAlign = mxConstants.ALIGN_TOP;
	overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt)
	{
		deleteSubtree(graph, cell);
	}));

	graph.addCellOverlay(cell, overlay);
}
};

function addChild(graph, cell)
{
var model = graph.getModel();
var parent = graph.getDefaultParent();

model.beginUpdate();
try
{
	var vertex = graph.insertVertex(parent, null, 'Double click to set name');
	var geometry = model.getGeometry(vertex);

	// Updates the geometry of the vertex with the
	// preferred size computed in the graph
	var size = graph.getPreferredSizeForCell(vertex);
	geometry.width = size.width;
	geometry.height = size.height;

	// Adds the edge between the existing cell
	// and the new vertex and executes the
	// automatic layout on the parent
	var edge = graph.insertEdge(parent, null, '', cell, vertex);

	// Configures the edge label "in-place" to reside
	// at the end of the edge (x = 1) and with an offset
	// of 20 pixels in negative, vertical direction.
	edge.geometry.x = 1;
	edge.geometry.y = 0;
	edge.geometry.offset = new mxPoint(0, -20);

	addOverlays(graph, vertex, true);
}
finally
{
	model.endUpdate();
}
};

function deleteSubtree(graph, cell)
{
// Gets the subtree from cell downwards
var cells = [];
graph.traverse(cell, true, function(vertex)
{
	cells.push(vertex);
	
	return true;
});

graph.removeCells(cells);
};