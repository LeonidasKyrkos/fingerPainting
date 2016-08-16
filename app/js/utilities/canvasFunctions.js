export function redraw(paths={},context) {
	let dots = [];

	if(!paths.x) {
		return;
	}

	if(!paths.x.length) {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

	} else {
		for(var i=0; i < paths.x.length; i++) {	
			context.beginPath();

			if(paths.drag[i]) {
				renderPath(paths.x[i],paths.x[i+1],paths.y[i],paths.y[i+1],context)
			} else {
				dots.push(i);
			}

			context.strokeStyle = paths.colours[i];
			context.shadowColor = paths.colours[i];
			context.lineWidth = paths.widths[i];			
			context.closePath();
			context.stroke();
		}

		renderDots(dots,paths,context);
	}	
}


export function renderPath(x1,x2,y1,y2,context) {
	context.moveTo(x1,y1);

	var x = (x1 + x2) / 2;
	var y = (y1 + y2) / 2;

	context.quadraticCurveTo(x, y, x2, y2);
}

function renderDots(dots,paths,context) {
	dots.forEach((pathIndex, index)=>{
		renderDot(paths.x[pathIndex],paths.y[pathIndex], paths.colours[pathIndex], context);
	});
}

export function renderDot(x,y,colour,context) {
	context.arc(x,y,context.lineWidth/2, 0, 2*Math.PI);
	context.fillStyle = colour;
	context.fill();
}

// clear the supplied context
export function clearContext(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}