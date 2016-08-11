export function redraw(paths={},context) {
	if(!paths.x) {
		return;
	}

	if(!paths.x.length) {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

	} else {	
		context.lineJoin = "round";
		context.shadowBlur = 1;
		context.lineWidth = 3;

		for(var i=0; i < paths.x.length; i++) {	
			context.beginPath();

			if(paths.drag[i]){
				renderPath(paths.x[i],paths.x[i+1],paths.y[i],paths.y[i+1],context)
			}else{
				renderDot(paths.x[i]-2, paths.x[i], paths.y[i], context)
			}

			context.strokeStyle = paths.colours[i];
			context.shadowColor = paths.colours[i];
			context.lineWidth = paths.widths[i];			
			context.closePath();
			context.stroke();
		}
	}
}


export function renderPath(x1,x2,y1,y2,context) {
	context.moveTo(x1,y1);

	var x = (x1 + x2) / 2;
	var y = (y1 + y2) / 2;

	context.quadraticCurveTo(x, y, x2, y2);
}

export function renderDot(x1,x2,y,context) {
	context.moveTo(x1, y);
	context.lineTo(x2, y);
}

// clear the supplied context
export function clearContext(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}