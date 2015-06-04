function toolbarMain(tempPanel,tPanel){

	// Defines an icon for creating new connections in the connection handler.
	// This will automatically disable the highlighting of the source vertex.
	mxConnectionHandler.prototype.connectImage = new mxImage(mxClient.basePath+'/images/connector.gif', 16, 16);

	// Checks if browser is supported
	if (!mxClient.isBrowserSupported())
	{
		// Displays an error message if the browser is
		// not supported.
		mxUtils.error('Browser is not supported!', 200, false);
	}
	else
	{
		// Creates the div for the toolbar
		var tbContainer = tPanel.body.dom;
		//tbContainer.style.position = 'absolute';
		tbContainer.style.overflow = 'auto';
		tbContainer.style.padding = '2px';
		tbContainer.style.left = '0px';
		tbContainer.style.top = '26px';
		tbContainer.style.width = '24px';
		tbContainer.style.bottom = '0px';
		
		document.body.appendChild(tbContainer);
		
		// Workaround for Internet Explorer ignoring certain styles
		if (mxClient.IS_IE)
		{
			new mxDivResizer(tbContainer);
		}
						
		// Creates new toolbar without event processing
		var toolbar = new mxToolbar(tbContainer);
		toolbar.enabled = false
		
		// Creates the div for the graph
		var container = tempPanel.body.dom;
		//container.style.position = 'absolute';
		container.style.overflow = 'auto';
		container.style.left = '24px';
		container.style.top = '26px';
		container.style.right = '0px';
		container.style.bottom = '0px';
		container.style.background = 'url("'+mxClient.basePath+'/editors/images/grid.gif")';

//		document.body.appendChild(container);
		
		// Workaround for Internet Explorer ignoring certain styles
		if (mxClient.IS_IE)
		{
			new mxDivResizer(container);
		}

		// Creates the model and the graph inside the container
		// using the fastest rendering available on the browser
		var model = new mxGraphModel();
		var graph = new mxGraph(container, model);

		// Enables new connections in the graph
		graph.setConnectable(true);
		graph.setMultigraph(false);

		// Stops editing on enter or escape keypress
		var keyHandler = new mxKeyHandler(graph);
		var rubberband = new mxRubberband(graph);
		
		var addVertex = function(icon, w, h, style)
		{
			var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
			vertex.setVertex(true);
		
			addToolbarItem(graph, toolbar, vertex, icon);
		};
		
		addVertex(mxClient.basePath+'/editors/images/rectangle.gif', 100, 40, '');
		addVertex(mxClient.basePath+'/editors/images/rounded.gif', 100, 40, 'shape=rounded');
		addVertex(mxClient.basePath+'/editors/images/ellipse.gif', 40, 40, 'shape=ellipse');
		addVertex(mxClient.basePath+'/editors/images/rhombus.gif', 40, 40, 'shape=rhombus');
		addVertex(mxClient.basePath+'/editors/images/triangle.gif', 40, 40, 'shape=triangle');
		addVertex(mxClient.basePath+'/editors/images/cylinder.gif', 40, 40, 'shape=cylinder');
		addVertex(mxClient.basePath+'/editors/images/actor.gif', 30, 40, 'shape=actor');
		toolbar.addLine();
		
		var button = mxUtils.button('Create toolbar entry from selection', function(evt)
		{
			if (!graph.isSelectionEmpty())
			{
				// Creates a copy of the selection array to preserve its state
				var cells = graph.getSelectionCells();
				var bounds = graph.getView().getBounds(cells);
				
				// Function that is executed when the image is dropped on
				// the graph. The cell argument points to the cell under
				// the mousepointer if there is one.
				var funct = function(graph, evt, cell)
				{
					graph.stopEditing(false);
	
					var pt = graph.getPointForEvent(evt);
					var dx = pt.x - bounds.x;
					var dy = pt.y - bounds.y;
					
					var clones = graph.importCells(cells, dx, dy);
					graph.setSelectionCells(clones);
				}
	
				// Creates the image which is used as the drag icon (preview)
				var img = toolbar.addMode(null, mxClient.basePath+'/editors/images/outline.gif', funct);
				mxUtils.makeDraggable(img, graph, funct);
			}
		});
	
		
		button.style.position = 'absolute';
		button.style.left = '2px';
		button.style.top = '2px';
		
		//document.body.appendChild(button);
	}
}



function addToolbarItem(graph, toolbar, prototype, image)
{
	// Function that is executed when the image is dropped on
	// the graph. The cell argument points to the cell under
	// the mousepointer if there is one.
	var funct = function(graph, evt, cell)
	{
		graph.stopEditing(false);

		var pt = graph.getPointForEvent(evt);
		var vertex = graph.getModel().cloneCell(prototype);
		vertex.geometry.x = pt.x;
		vertex.geometry.y = pt.y;
			
		graph.addCell(vertex);
		graph.setSelectionCell(vertex);
	}

	// Creates the image which is used as the drag icon (preview)
	var img = toolbar.addMode(null, image, funct);
	mxUtils.makeDraggable(img, graph, funct);
}