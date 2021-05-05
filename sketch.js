let draw_area_width;
let draw_area_height;
let pivot; //ピボット

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
  draw_area_width =　window.innerHeight * 0.9;
  draw_area_height = draw_area_width;
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

  var settings = QuickSettings.create(0, 0, 'Settings (double tap to fold)')
    // .setDraggable(false)
    .setPosition(50, 50)
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
      pColor.setAlpha(value);
      console.log(pColor);
      // alphaValue = value;
    })
    .addButton('Clear', function () {
      // background(255, 255, 255);
      clear();
    })
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
  //色、ブラシサイズ、間隔、ジッターポジション（マウス以外）
  // paramUpdate();

  if (mouseIsPressed) {

    push();
    translate(pivot.xpos, pivot.ypos); //原点を描画領域の中心に

    //位置・サイズ更新ここから
    currentBrush.posUpdate(pmouseX, pmouseY, mouseX, mouseY);
    currentBrush.pxpos -= pivot.xpos;
    currentBrush.pypos -= pivot.ypos;
    currentBrush.xpos -= pivot.xpos;
    currentBrush.ypos -= pivot.ypos;

    //位置・サイズ更新ここまで
    pop();

    let cnt = 0;
    for (let i = 0; cnt < segmentNumber; i += TWO_PI / segmentNumber) {
      push();
      translate(pivot.xpos, pivot.ypos); //原点を描画領域の中心に
      rotate(i);
      //図形描画ここから
      currentBrush.drawStroke();
      pop();
      cnt++;
    }
  }

}

function paramUpdate() {
  currentBrush.sizeUpdate(brushSize);
}


class Brush {
  constructor(px, py, x, y, c, s) {
    this.pxpos = px;
    this.pypos = py;
    this.xpos = x;
    this.ypos = y;
    this.col = c;
    this.size = s;
  }
  //位置の更新
  posUpdate(px, py, x, y) {
    this.pxpos = px;
    this.pypos = py;
    this.xpos = x;
    this.ypos = y;
  }
  //色の更新
  colUpdate(c) {
    this.col = color(c);
  }
  //サイズの更新
  sizeUpdate(s) {
    this.size = s;
  }
  drawStroke() {
  }
  drawFill() {
  }
}

//線ブラシ
class B_Line extends Brush {
  constructor(px, py, x, y, c, s) {
    super(px, py, x, y, c, s);
  }
  drawStroke() {
    stroke(redValue, greenValue, blueValue, alphaValue);
    strokeWeight(brushSize);
    line(this.pxpos, this.pypos, this.xpos, this.ypos);
  }
}

//長方形ブラシ
class B_Square extends Brush {
  constructor(px, py, x, y, c, s) {
    super(px, py, x, y, c, s);
  }

  drawStroke() {
    rectMode(CENTER);
    noFill();
    stroke(redValue, greenValue, blueValue, alphaValue);

    square(this.xpos, this.ypos, brushSize);

  }
}

//楕円形ブラシ
class B_Circle extends Brush {
  constructor(px, py, x, y, f, c, s) {
    super(px, py, x, y, f, c, s);
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

