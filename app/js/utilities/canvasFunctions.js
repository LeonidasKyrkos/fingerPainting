export function redraw(paths,context) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	
	context.lineJoin = "round";
	context.shadowBlur = 1;
	context.lineWidth = 5;

	for(var i=0; i < paths.x.length; i++) {		
		context.beginPath();

		if(paths.drag[i] && i){
			context.moveTo(paths.x[i-1], paths.y[i-1]);
		}else{
			context.moveTo(paths.x[i]-1, paths.y[i]);
		}

		context.strokeStyle = paths.colours[i];
		context.shadowColor = paths.colours[i];
		context.lineTo(paths.x[i], paths.y[i]);
		context.closePath();
		context.stroke();
	}
}


export function renderPath(path,ctx) {
	let first = path[0];
	let length = path.length;

	ctx.moveTo(first.x,first.y);
	ctx.beginPath();

	path.forEach((item,index)=>{
		if(index > 0 && index < length - 2) {
			if(item.joined) {
				var x = (item.x + path[index + 1].x) / 2;
				var y = (item.y + path[index + 1].y) / 2;
			} else {
				var x = (item.x + path[index + 1].x) / 2;
				var y = (item.y + path[index + 1].y) / 2;
			}

			ctx.quadraticCurveTo(item.x, item.y, x, y);
		}

		ctx.lineWidth = first.size;
		ctx.strokeStyle = first.color;
		ctx.shadowBlur = 1;
		ctx.shadowColor = first.color;
		ctx.stroke();
	});

	ctx.closePath();
}

export function renderDot(path,ctx) {
	let obj = path[0];

	ctx.beginPath();
	ctx.arc(obj.x, obj.y, obj.size / 2, 0, 2 * Math.PI, false);
	ctx.fillStyle = obj.color;
	ctx.fill();
	ctx.closePath();
}

// clear the supplied context
export function clearContext(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}