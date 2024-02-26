let leftShip;
let rightShip;

function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('gameCanvas'); // Set parent for canvas
    leftShip = new Ship(width * 0.33);
    rightShip = new Ship(width * 0.66);
}

function draw() {
    background(0);

    leftShip.update();
    rightShip.update();

    leftShip.display();
    rightShip.display();
}
