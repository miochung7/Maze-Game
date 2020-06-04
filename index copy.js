// Adds the Matter global variable, everything will be contained in this object

const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    MouseConstraint,
    Mouse
} = Matter; // Pulling properties from the Matter library

// Boilerplate code
const width = 800;
const height = 600;

const engine = Engine.create(); // creates new engine
const {
    world
} = engine; // gain access to world, so engine is the world. World is coming from engine, when engine is created we get a world object with it
const render = Render.create({ //creates a canvas, a render object - shows the content on the screen
    element: document.body, // tells renders the representation of world in document.body
    engine: engine, // specifies what engine to use
    options: { // Passes in options object
        wireframes: false, // will render a solid shape instead of outline
        width, // Specify height/width of our canvas element to display the content
        height
    }
});
Render.run(render); // tells render object to start working and to draw updates of our world onto the screen
Runner.run(Runner.create(), engine); //Runner is coordinates the changes from state A to state B of our engine 

// Clicking and dragging
World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}));

// Create Walls

const walls = [
    Bodies.rectangle(400, 0, 800, 40, { // creates a new rectangle (x, y, w, h)
        isStatic: true // // options object - true means the shape will not move at all
    }),
    Bodies.rectangle(400, 600, 800, 40, {
        isStatic: true
    }),
    Bodies.rectangle(0, 300, 40, 600, {
        isStatic: true
    }),
    Bodies.rectangle(800, 300, 40, 600, {
        isStatic: true
    }),
];
World.add(world, walls); // first argument - the world you want to add to, second argument - adds shape to world object to show up on screen

// Random Shapes

for (let i = 0; i < 25; i++) {
    if (Math.random() > 0.5) {
        World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)); // Creates a rectangle in the world
    } else {
        World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, 35, { // .circle(x,y,radius)
            render: {
                fillStyle: 'pink'
            }
        }));
    }
}