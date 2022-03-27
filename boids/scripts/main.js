import Vector from "./2D/vector.js";
import Rect from "./2D/rect.js";
import Circle from "./2D/circle.js";
import QuadTree from "./2D/quadTree.js";

import AnimationTime from "/static/scripts/animationTime.js";

import FlockUnit from "./flockUnit.js";
import Pillars from "./pillar.js";

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

let mousePoint;
canvas.addEventListener('mousemove', e => {
	mousePoint = new Vector(e.offsetX, e.offsetY);
});



// benchmark
const benchmark = {
	func(n) {
		for (let i = 0; i < n; i++) {
			let number = Math.random();
			number *= 1000;
			let bool;
			if (number < 500) bool = false;
			else bool = true;

			number *= number;
			if (bool) number *= 42;
			else number *= 6;

			number /= 12;
		}
	},
	benchmarking: true,
	index: 1
}
benchmark.start = Date.now();
while (Date.now() - benchmark.start < 50) {
	benchmark.func(benchmark.index++);
}
benchmark.end = Date.now();
benchmark.score = 2.25 * (benchmark.index - 1) / (benchmark.end - benchmark.start);
console.log(benchmark.score);

// create flock
let flock = new Array(Math.floor(benchmark.score));
// var flock = new Array(16);
for (let i = 0; i < flock.length; i++) {
	var randomPos = new Vector(canvas.width * Math.random(), canvas.height * Math.random());
	var randomVel = new Vector(100 * (Math.random() - 0.5), 100 * (Math.random() - 0.5));
	flock[i] = new FlockUnit(randomPos.x, randomPos.y, randomVel.x, randomVel.y);
}
var debugFlock = flock.at(Math.round(Math.random() * (flock.length - 1)));

// pillars
let pillars = new Pillars();
canvas.addEventListener('click', e => {
	let find = pillars.findPillar(e.offsetX, e.offsetY);
	if(find) {
		pillars.popPillar(find);
	} else {
		pillars.pushPillar(e.offsetX, e.offsetY);
	}
});

// canvas resize
window.addEventListener('resize', () => {
	canvas.width = body.clientWidth;
	canvas.height = body.clientHeight;

	// flock reposition
	flock.forEach(unit => {
		unit.position.x *= canvas.width / prevCanvasRect.w;
		unit.position.y *= canvas.height / prevCanvasRect.h;
	});

	// pillar reposition
	pillars.forEach(pillar => {
		pillar.circle.x *= canvas.width / prevCanvasRect.w;
		pillar.circle.y *= canvas.height / prevCanvasRect.h;
	});

	prevCanvasRect.w = canvas.width;
	prevCanvasRect.h = canvas.height;
});

let flockQuadTree = new QuadTree();

let time = new AnimationTime();
let animationId;
function draw(timestamp) {
	time.update(timestamp);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// quadtree
	let boundary = new Rect(0, 0, canvas.width, canvas.height);
	flockQuadTree = new QuadTree(boundary, 1);
	flock.forEach(unit => {
		flockQuadTree.insert(unit);
	});

	// flock velocity, position calculation
	flock.forEach(unit => {
		unit.updateFromQuadTree(flockQuadTree, pillars, time.deltaTime);
	});
	flock.forEach(unit => {
		unit.accelerateToTargetVelocity(time.deltaTime);
		unit.move(time.deltaTime);
	});

	// flock visualize
	flock.forEach(unit => {
		unit.draw(ctx);
	});
	// pillar visualize
	pillars.forEach(pillar => {
		ctx.save();
		ctx.strokeStyle = 'rgba(0,0,0,0)';
		ctx.fillStyle = '#f7f7f7';
		pillar.circle.draw(ctx);
		ctx.restore();
	});

	// debug flock
	//#region 
	// ctx.strokeStyle = ctx.fillStyle = 'lime';
	// let debugFlockRect = new Rect(debugFlock.x - 4, debugFlock.y - 4, 8, 8);
	// debugFlockRect.draw(ctx);

	// let debugCircle = new Circle(new Vector(debugFlock.x, debugFlock.y), debugFlock.detectionRange);
	// let debugCircle2 = new Circle(new Vector(debugFlock.x, debugFlock.y), debugFlock.separationRange);
	// ctx.fillStyle = 'rgba(0, 0, 0, 0)';
	// ctx.strokeStyle = 'green';
	// debugCircle.draw(ctx);
	// ctx.strokeStyle = 'orange';
	// debugCircle2.draw(ctx);

	// target velocity
	// ctx.strokeStyle = 'red';
	// ctx.beginPath();
	// ctx.moveTo(debugFlock.x, debugFlock.y);
	// ctx.lineTo(debugFlock.x + debugFlock.targetVelocity.x, debugFlock.y + debugFlock.targetVelocity.y);
	// ctx.stroke();

	// velocity
	// ctx.strokeStyle = 'yellow';
	// ctx.beginPath();
	// ctx.moveTo(debugFlock.x, debugFlock.y);
	// ctx.lineTo(debugFlock.x + debugFlock.velocity.x, debugFlock.y + debugFlock.velocity.y);
	// ctx.stroke();

	// prediction
	// let prediction = Vector.multiply(debugFlock.velocity, 0.54 * debugFlock.velocity.magnitude / debugFlock.acceleration).add(debugFlock);
	// ctx.fillStyle = 'cyan';
	// ctx.fillRect(prediction.x - 1, prediction.y - 1, 2, 2);
	//#endregion

	// quadtree visualize
	// ctx.lineWidth = 1;
	// ctx.strokeStyle = '#ffffff';
	// ctx.fillStyle = 'rgba(0, 0, 0, 0)';
	// flockQuadTree.draw(ctx);

	// quadtree debug
	// if (Date.now() % 1000 < 1000 / 60) console.log(flockQuadTree.query(flockQuadTree.boundary).length);
	
	// debug
	// if (Date.now() % 1000 < 1000 / 60) console.log(debugFlock);

	animationId = window.requestAnimationFrame(draw);
}
animationId = window.requestAnimationFrame(draw);
// pause and resume
document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		window.cancelAnimationFrame(animationId);
	} else {
		time.resume();
		animationId = window.requestAnimationFrame(draw);
	}
});
