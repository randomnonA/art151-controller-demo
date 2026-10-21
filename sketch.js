let x, y; //current cursor position
let px, py; //previous cursor position
let brushSize; //brush thickness
let drawColor; //current color
let rainbow; //determines rainbow mode

// used to detect button presses only once
let previousButtons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);
  
  x = width/2;
  y = height/2;
  px = x;
  py = y;
  drawColor = color(0);
  strokeWeight(brushSize);
  textAlign(CENTER, CENTER);
}

function draw() {
  //create instructions when no controller is connected
  let gp = navigator.getGamepads()[0];
  if (!gp) {
    fill(0);
    noStroke();
    textSize(24);
    text("Connect ur controller folkum n press a button", width/2, height/2);
    return;
  }
  
  //left joystick
  let deadzone = 0.15;//ignores tiny movements from the controller bc of stick drift
  let dx = abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
  let dy = abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;
  
  let speed = 8;
  px = x;
  py = y;
  x += dx * speed;
  y += dy * speed;
  x = constrain(x, 0, width);
  y = constrain(y, 0, height);
  
  //rainbow mode
  if (rainbow) {
    drawColor = color(random(255), random(255), random(255));
  }
  stroke(drawColor);
  strokeWeight(brushSize);
  line(px, py, x, y);
  
  //triggers
  let leftTrigger = gp.buttons[6].value;
  let rightTrigger = gp.buttons[7].value;
  
  brushSize = map(rightTrigger - leftTrigger, -1 ,1, 1, 30);
  brushSize = constrain(brushSize, 1, 30);
  handleButtons(gp);
  
}

function handleButtons(gp) {
  gp.buttons.forEach((button, index) => {
    let currentPressed = button.pressed;
    let previousPressed = previousButtons[index] || false;
    
    //newly pressed
    if (currentPressed && !previousPressed) {
      switch(index) {
          //A
        case 0:
          drawColor = color(random(255),random(255),random(255));
          rainbow = false;
          break;
          
          //B
        case 1:
          background(240);
          break;
          
          //Y
        case 2:
          rainbow = !rainbow;
          break;
          
          //X
        case 3:
          saveCanvas('etcha_gp', "png");
          break;
          
          
      }
    }
    
    previousButtons[index] = currentPressed;
  });
}