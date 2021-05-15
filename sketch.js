let draw_area_width;
let draw_area_height;
let pivot;

var cnv;

var p_pivotX;
var p_pivotY;
var segmentNumber = 100;
var brushShape = ['line', 'circle', 'square'];
var brushSize = 5;
var brushColor = '#ff99dd';

var gui;
var canvas;

var pColor;
let redValue = 255;
let greenValue = 153;
let blueValue = 221;
let alphaValue = 100;

var currentBrush;
var squareBrush;
var circleBrush;
var lineBrush;
var spacing_count = 0;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  if (window.innerWidth > window.innerHeight) {
    draw_area_width = window.innerHeight * 0.9;
    draw_area_height = draw_area_width;
  }
  else {
    draw_area_width = window.innerWidth * 0.9;
    draw_area_height = draw_area_width;
  }
  cnv = createCanvas(draw_area_width, draw_area_height);
  centerCanvas();
  colorMode(RGB, 255);

  p_pivotX = draw_area_width / 2;
  p_pivotY = draw_area_height / 2;
  pivot = new Pivot(p_pivotX, p_pivotY, true);
  savecount = 1;

  //ブラシ
  squareBrush = new B_Square();
  circleBrush = new B_Circle();
  lineBrush = new B_Line();
  currentBrush = lineBrush;

  var settings = QuickSettings.create(0, 0, 'Settings (double click to fold)')
    // .setDraggable(false)
    .setPosition(5, 5)
    .addNumber('Segment Number', 1, 500, segmentNumber, 1, function (value) {
      segmentNumber = value;
    })
    .addColor('Brsuh Color', brushColor, function (color) {
      pColor = color;
      redValue = red(pColor);
      greenValue = green(pColor);
      blueValue = blue(pColor);
    })
    .addDropDown('Brush Shape', ['line', 'circle', 'square'], function (value) {
      switch (value.index) {
        case 0:
          currentBrush = lineBrush;
          console.log("aaa");
          break;
        case 1:
          currentBrush = circleBrush;
          break;
        case 2:
          currentBrush = squareBrush;
          break;
      }
    })
    .addRange('Brush Size', 1, 500, brushSize, 1, function (value) {
      brushSize = value;
    })
    .addRange('Flow', 0, 255, alphaValue, 1, function (value) {
      alphaValue = value;
    })
    .addButton('Clear', function () {
      // background(255, 255, 255);
      clear();
    })
    .addHTML('説明', 'リロードするとキャンバスのサイズを最適化できます。<br>下の「Download」ボタンで現在のキャンバスをpng画像として保存できます。')
    .addButton('Download', function () {
      let canvas = document.getElementById('defaultCanvas0');
      let link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'test.png';
      link.click();
    });

  let guiArea = document.querySelectorAll('.qs_main');
  guiArea[0].addEventListener('mouseenter', e => {
    if (mouseIsPressed == false) {
      menuEdit = true;
    }
  }, false);
  guiArea[0].addEventListener('mouseleave', e => {
    menuEdit = false;
  }, false);
}



function draw() {
  if (mouseIsPressed) {
    push();
    translate(pivot.xpos, pivot.ypos); //原点を描画領域の中心に
    //位置更新
    currentBrush.posUpdate(pmouseX, pmouseY, mouseX, mouseY);
    currentBrush.pxpos -= pivot.xpos;
    currentBrush.pypos -= pivot.ypos;
    currentBrush.xpos -= pivot.xpos;
    currentBrush.ypos -= pivot.ypos;
    pop();

    let cnt = 0;
    for (let i = 0; cnt < segmentNumber; i += TWO_PI / segmentNumber) {
      push();
      translate(pivot.xpos, pivot.ypos); //原点を描画領域の中心に
      rotate(i);
      currentBrush.drawStroke();
      pop();
      cnt++;
    }
  }
}

class Brush {
  constructor(px, py, x, y) {
    this.pxpos = px;
    this.pypos = py;
    this.xpos = x;
    this.ypos = y;
  }
  posUpdate(px, py, x, y) {
    this.pxpos = px;
    this.pypos = py;
    this.xpos = x;
    this.ypos = y;
  }
  drawStroke() {
  }
  drawFill() {
  }
}

class B_Line extends Brush {
  constructor(px, py, x, y) {
    super(px, py, x, y);
  }
  drawStroke() {
    stroke(redValue, greenValue, blueValue, alphaValue);
    strokeWeight(brushSize);
    line(this.pxpos, this.pypos, this.xpos, this.ypos);
  }
}

class B_Square extends Brush {
  constructor(px, py, x, y) {
    super(px, py, x, y);
  }

  drawStroke() {
    rectMode(CENTER);
    noFill();
    stroke(redValue, greenValue, blueValue, alphaValue);
    square(this.xpos, this.ypos, brushSize);
  }
}

class B_Circle extends Brush {
  constructor(px, py, x, y) {
    super(px, py, x, y);
  }

  drawStroke() {
    ellipseMode(CENTER);
    noFill();
    stroke(redValue, greenValue, blueValue, alphaValue);
    circle(this.xpos, this.ypos, brushSize);
  }
}

class Pivot {
  constructor(x, y, s) {
    this.xpos = x;
    this.ypos = y;
    this.show = s;
  }

  pShow() {
    this.show = true;
  }
  pHide() {
    this.show = false;
  }
  posUpdate(x, y) {
    this.xpos = x;
    this.ypos = y;
  }
  draw() {
    stroke(0);
    strokeWeight(1);
    line(-10, 0, 10, 0);
    line(0, -10, 0, 10);
  }
}

