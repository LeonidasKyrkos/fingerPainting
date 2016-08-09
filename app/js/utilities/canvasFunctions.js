export function redraw(paths,canvas,ctx) {
	if(!paths.length) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		return;
	} else {
		ctx.beginPath();
		paths.forEach((path,index)=>{
			if(path.length < 4) {
				renderDot(path,ctx);
			} else {
				renderPath(path,ctx);
			}
		});
	}	
}


export function renderPath(path,ctx) {
	let first = path[0];
	let length = path.length;

	ctx.moveTo(first.x,first.y);	

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