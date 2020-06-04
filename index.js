/*
Added new features
Reset button - and when pressed reloads the page. 
Listened for extra key events like the arrow buttons. 
*/

// Adds the Matter global variable, everything will be contained in this object

const {
	Engine,
	Render,
	Runner,
	World,
	Bodies,
	Body, // Can change properties of shapes
	Events // Listens for events inside the world object
} = Matter; // Pulling properties from the Matter library

const cellsHorizontal = 7;
const cellsVertical = 6;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

// Boilerplate code
const engine = Engine.create(); // creates new engine
engine.world.gravity.y = 0; // disable gravity on Y direction
const { world } = engine; // gain access to world, so engine is the world. World is coming from engine, when engine is created we get a world object with it
const render = Render.create({
	//creates a canvas, a render object - shows the content on the screen
	element: document.body, // tells renders the representation of world in document.body
	engine: engine, // specifies what engine to use
	options: {
		// Passes in options object
		wireframes: false, // will render a solid shape instead of outline
		width, // Specify height/width of our canvas element to display the content
		height,
		background: '#ffb6b9'
	}
});
Render.run(render); // tells render object to start working and to draw updates of our world onto the screen
Runner.run(Runner.create(), engine); //Runner is coordinates the changes from state A to state B of our engine

// Create Walls

const walls = [
	// creates a new rectangle (x, y, w, h)
	Bodies.rectangle(width / 2, 0, width, 2, {
		isStatic: true // options object - true means the shape will not move at all
	}),
	Bodies.rectangle(width / 2, height, width, 2, {
		isStatic: true
	}),
	Bodies.rectangle(0, height / 2, 2, height, {
		isStatic: true
	}),
	Bodies.rectangle(width, height / 2, 2, height, {
		isStatic: true
	})
];
World.add(world, walls); // first argument - the world you want to add to, second argument - adds shape to world object to show up on screen

/* Array(3) - creates an empty array that has 3 empty places in it. 
fill - adds 3 undefined value
map - each element creates a new array with 3 elements of false
*/

// Maze Generation 3x3 grid

const shuffle = (arr) => {
	let counter = arr.length;

	while (counter > 0) {
		const index = Math.floor(Math.random() * counter); // Picks a random index inside of the array
		counter--;

		const temp = arr[counter];
		// Swaps the index
		arr[counter] = arr[index]; // Value of arr[counter] equal to arr[index]
		arr[index] = temp; // Value of arr[index] equal to the value in temp
	}

	return arr;
};

const grid = Array(cellsVertical) // 3
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false)); // 4

const verticals = Array(cellsVertical) // 3
	.fill(null)
	.map(() => Array(cellsHorizontal - 1).fill(false)); // 4-1 = 3

const horizontals = Array(cellsVertical - 1) // 3-1 = 2
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false)); // 4

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
	// If I have visited the cell at [row, column] then return
	if (grid[row][column]) {
		return;
	}

	// Mark this cell as being visited - update element in grid array to true
	grid[row][column] = true;

	// Assemble randonmly list of neighbours -
	const neighbours = shuffle([
		[
			row - 1,
			column,
			'up'
		],
		[
			row,
			column + 1,
			'right'
		],
		[
			row + 1,
			column,
			'down'
		],
		[
			row,
			column - 1,
			'left'
		]
	]);

	// For each neighbour ...
	for (let neighbour of neighbours) {
		const [
			nextRow,
			nextColumn,
			direction
		] = neighbour;
		// Check to see if that neighbour is out of bounds
		if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
			continue; // doesn't leave the loop, skips the rest of the iteration, and moves on to the next neighbour
		}

		// Check if we have visited that neighbour continue to next neighbour
		if (grid[nextRow][nextColumn]) {
			continue;
		}
		// Remove a wall from either horizontals/verticals array
		if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else if (direction === 'right') {
			verticals[row][column] = true;
		} else if (direction === 'up') {
			horizontals[row - 1][column] = true;
		} else if (direction === 'down') {
			horizontals[row][column] = true;
		}
		stepThroughCell(nextRow, nextColumn); // Visit that next cell, then call stepThroughCell again and pass in [row,column] we're about to visit
	}
};

stepThroughCell(startRow, startColumn);

// Drawing a horizontal wall

horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			// (x,y,w,h)
			columnIndex * unitLengthX + unitLengthX / 2,
			rowIndex * unitLengthY + unitLengthY,
			unitLengthX,
			3,
			{
				label: 'wall',
				isStatic: true,
				render: {
					fillStyle: '#bbded6' // customise colour
				}
			}
		);
		World.add(world, wall);
	});
});

// Drawing a vertical wall

verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX,
			rowIndex * unitLengthY + unitLengthY / 2,
			3,
			unitLengthY,
			{
				label: 'wall',
				isStatic: true,
				render: {
					fillStyle: '#bbded6' // customise colour
				}
			}
		);
		World.add(world, wall);
	});
});

// Goal

const goal = Bodies.rectangle(width - unitLengthX / 2, height - unitLengthY / 2, unitLengthX * 0.7, unitLengthY * 0.7, {
	label: 'goal',
	isStatic: true,
	render: {
		fillStyle: '#61c0bf' // customise colour
	}
});
World.add(world, goal);

// Draw a playing ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
	label: 'ball',
	render: {
		fillStyle: '#fae3d9' // customise colour
	}
});
World.add(world, ball);

// event listener for controls

document.addEventListener('keydown', (event) => {
	const { x, y } = ball.velocity;

	if (event.keyCode === 87 || event.keyCode === 38) {
		Body.setVelocity(ball, {
			x,
			y: y - 5
		});
	}
	if (event.keyCode === 68 || event.keyCode === 39) {
		Body.setVelocity(ball, {
			x: x + 5,
			y
		});
	}
	if (event.keyCode === 83 || event.keyCode === 40) {
		Body.setVelocity(ball, {
			x,
			y: y + 5
		});
	}
	if (event.keyCode === 65 || event.keyCode === 37) {
		Body.setVelocity(ball, {
			x: x - 5,
			y
		});
	}
});

// Win Condition

/* 
Every collision, adds some properties to event object to describe what's happened.
Sends the object into callback function below, when it runs the properties are wiped and removed
In event object, there is pairs which is an array, will iterate through it to see whats inside, contains lots of properties. 
bodyA & bodyB properties inside event object describes the 2 shapes that collided.
 */

Events.on(engine, 'collisionStart', (event) => {
	event.pairs.forEach((collision) => {
		const labels = [
			'ball',
			'goal'
		];
		if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
			resetButton();
			horizontals.clear;
			document.querySelector('.winner').classList.remove('hidden');
			world.gravity.y = 1; // Adds gravity
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false); // (body, false) - takes the body object and sets static to false
				}
			});
		}
	});
});

// Reset Button

const resetButton = () => {
	const btn = document.querySelector('.btn');
	btn.innerText = 'PLAY AGAIN';
	btn.addEventListener('click', (event) => {
		location.reload();
	});
};
