var body = document.body;

var canvas = document.createElement('canvas');
canvas.width = body.clientWidth;
canvas.height = body.clientHeight;
var prevCanvasRect = new Rect(0, 0, canvas.width, canvas.height);
var ctx = canvas.getContext('2d');

// place canvas
while (document.body.firstChild) {
	body.removeChild(document.body.firstChild);
}
body.appendChild(canvas);

var mousePoint = new Vector();
canvas.addEventListener('mousemove', e => {
	mousePoint = new Vector(e.offsetX, e.offsetY);
});



// flockunit color, draw definition
Object.defineProperties(FlockUnit.prototype, {
	color: {
		value: '#3fbfff'
	},
	draw: {
		value(ctx) {
			if(!(ctx instanceof CanvasRenderingContext2D))
				throw new TypeError('Argument is not a CanvasRenderingContext2D');

			ctx.fillStyle = this.color;
			ctx.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);
		}
	}
});

// create flock
var flock = new Array(300);
for (let i = 0; i < flock.length; i++) {
	var randomPos = new Vector(canvas.width * Math.random(), canvas.height * Math.random());
	var randomVel = new Vector(100 * (Math.random() - 0.5), 100 * (Math.random() - 0.5));
	flock[i] = new FlockUnit(randomPos, randomVel);
}
var debugFlock = flock.at(Math.round(Math.random() * (flock.length - 1)));

// canvas resize
window.addEventListener('resize', e => {
	canvas.width = body.clientWidth;
	canvas.height = body.clientHeight;

	// flock reposition
	flock.forEach(unit => {
		unit.position.x *= canvas.width / prevCanvasRect.w;
		unit.position.y *= canvas.height / prevCanvasRect.h;
	});

	prevCanvasRect.w = canvas.width;
	prevCanvasRect.h = canvas.height;
});

var time = new AnimationTime();
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	time.update();

	// flock in quadtree
	let boundary = new Rect(0, 0, canvas.width, canvas.height);
	let quadTree = new QuadTree(boundary, 1);
	flock.forEach(unit => {
		quadTree.insert(unit);
	});
	
	// flock velocity, position calculation
	flock.forEach(unit => {
		unit.updateFromQueryable(quadTree, time.deltaTime);
	});
	flock.forEach(unit => {
		unit.accelerateToTargetVelocity(time.deltaTime);
		unit.move(time.deltaTime);
	});

	// flock viasualize
	flock.forEach(unit => {
		unit.draw(ctx);
	});

	// debug flock
	ctx.fillStyle = 'red';
	let debugFlockRect = new Rect(debugFlock.x - 4, debugFlock.y - 4, 8, 8);
	debugFlockRect.draw(ctx);

	let debugCircle = new Circle(new Vector(debugFlock.x, debugFlock.y), debugFlock.detectionRange);
	let debugCircle2 = new Circle(new Vector(debugFlock.x, debugFlock.y), debugFlock.separationRange);
	ctx.fillStyle = 'rgba(0, 0, 0, 0)';
	ctx.strokeStyle = 'green';
	debugCircle.draw(ctx);
	ctx.strokeStyle = 'red';
	debugCircle2.draw(ctx);

	// quadtree visualize
	// ctx.lineWidth = 1;
	// ctx.strokeStyle = '#ffffff';
	// ctx.fillStyle = 'rgba(0, 0, 0, 0)';
	// quadTree.draw(ctx);

	window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);
