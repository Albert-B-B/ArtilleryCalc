

let activeRegionImage;
let artyPos = [0,0];
let targetPos = [0,0];
let spotterPos = [0,0];

let windStrength = 0
let windAngle = 0
let windBias = [0,0]

let artyDrawFlag = false;
let targetDrawFlag = false;
let spotterDrawFlag = false;
let canvasHeight = 888;
let canvasWidth  = 1024;
let regionHeight = 888;
let regionWidth  = 1024;
let mapWidthMeter = 1097*2; //1097 comes from https://foxhole.fandom.com/wiki/Community_Guides/Map_Guide.
let px2mconst = mapWidthMeter/regionWidth;
let circleSize = 7;
let moveState = 0;

let minRange = 0;
let maxRange = 0;

let moveX = 0;
let moveY = 0;
let zoom =  1;

let lastX = 0;
let lastY = 0;
function preload() {

}
function changeRegion(){
  path = document.getElementById("regionSelect").options[document.getElementById("regionSelect").selectedIndex].value;
  activeRegionImage = loadImage(path);
}
function changeGun(){
  if (document.getElementById("gunSelect").selectedIndex==0) {minRange=75;maxRange=250;}//Koronides
  else if (document.getElementById("gunSelect").selectedIndex==1) {minRange=100;maxRange=300;}//Huber Lariat 120mm
  else if (document.getElementById("gunSelect").selectedIndex==2) {minRange=100;maxRange=300;}//Huber Exalt 150mm
  else if (document.getElementById("gunSelect").selectedIndex==3) {minRange=200;maxRange=350;}//50-500 “Thunderbolt” Cannon
  else if (document.getElementById("gunSelect").selectedIndex==4) {minRange=45;maxRange=80;}//Cremari Mortar
}
function setup() {
  changeGun();
  changeRegion();
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('sketch-holder');
}

function dis(x1,y1,x2,y2) {
    return sqrt((x1-x2)**2+(y1-y2)**2)
}

function px2m(numb){
  return numb*px2mconst;
}

function m2px(numb) {
  return numb/px2mconst;
}

function getAngle(y,x){
  angle = Math.atan2(y,x)*180/Math.PI
  if (angle < 0) {
    angle = 360+angle;
  }
  angle += 90
  angle = angle % 360
  return angle
}


function updateWind(){
  windStrength = m2px(document.getElementById("windStrength").value)
  windAngle = document.getElementById("windDirection").value
  windAngle -= 90
  windAngle = windAngle % 360
  windBias[0] = Math.cos(windAngle*Math.PI/180)*windStrength
  windBias[1] = Math.sin(windAngle*Math.PI/180)*windStrength
  console.log(windBias)
}

function draw() {
  if (moveState == 4) {
    deltaX = (mouseX-lastX)*zoom
    deltaY = (mouseY-lastY)*zoom
    moveX -= deltaX
    moveY -= deltaY
    if (moveX < 0) {
      moveX += deltaX
    }
    else if (moveX+regionWidth*zoom>canvasWidth){
      moveX += deltaX
    }
    else {
      artyPos[0] +=deltaX/zoom
      targetPos[0] +=deltaX/zoom
    }
    if (moveY < 0) {
      moveY += deltaY
    }
    else if (moveY+regionHeight*zoom>canvasHeight){
      moveY += deltaY
    }
    else {
      artyPos[1] +=deltaY/zoom
      targetPos[1] +=deltaY/zoom
    }
  }
  lastX = mouseX
  lastY = mouseY
  clear();
  image(activeRegionImage,0, 0,canvasWidth,canvasHeight,moveX,moveY,regionWidth*zoom,regionHeight*zoom)
  //Are any of the circles being placed
  if (moveState == 1) {artyPos = [mouseX,mouseY];artyDrawFlag = true}
  else if (moveState == 2) {targetPos = [mouseX,mouseY];targetDrawFlag = true}
  else if (moveState == 3) {spotterPos = [mouseX,mouseY];spotterDrawFlag = true}

  //Draw artillery
  if (artyDrawFlag){
    fill('#2f7a04');
    circle(artyPos[0], artyPos[1], circleSize);
    if (document.getElementById("rangeToggle").checked){
      fill(255, 0, 0, 60);
      circle(artyPos[0], artyPos[1], m2px(minRange)*2/zoom);
      fill(0, 255, 0, 40);
      circle(artyPos[0], artyPos[1], m2px(maxRange)*2/zoom);
    }
  }//Target
  if (targetDrawFlag){
  fill('#ab0011');
  circle(targetPos[0], targetPos[1], circleSize);}//Target
  if (spotterDrawFlag){
  fill('#98a300');
  circle(spotterPos[0], spotterPos[1], circleSize);}//Spotter
  document.getElementById("distanceP").innerHTML = "Distance: " + str(Math.round(zoom*int(px2m(dis(targetPos[0]-windBias[0],targetPos[1]-windBias[1],artyPos[0],artyPos[1])))))+" m"
  document.getElementById("azimuthP").innerHTML = "Azimuth: " + str(Math.round(getAngle(targetPos[1]-windBias[1]-artyPos[1], targetPos[0]-windBias[0]-artyPos[0])*10)/10) + " deg"
  textSize(20);
  fill(255, 255, 255);
  text('Zoom ' + str(Math.round(zoom*100)/100)+"x", 50, 50);
}
//For moving map
function mousePressed(){
  if (moveState == 0) {
    moveState = 4;
  }
  if (Math.abs(mouseX-artyPos[0])<15 && Math.abs(mouseY-artyPos[1])<15) {moveState = 1;}
  if (Math.abs(mouseX-targetPos[0])<15 && Math.abs(mouseY-targetPos[1])<15) {moveState = 2;}
}
//For stopping to move or set dots
function mouseReleased(){
  moveState = 0;
}
//For zooming
function mouseWheel(event) {
  change = event.delta/2000;
  zoom += change;
  if (zoom < 0.04) {
    zoom -= change;
    return;
  }
  if (regionWidth*zoom > canvasWidth) {
    zoom -= change;
    return;
  }
  prevZoom = zoom-change;
  artyPos[0]=artyPos[0]*(prevZoom/zoom);
  artyPos[1]=artyPos[1]*(prevZoom/zoom);

  targetPos[0]=targetPos[0]*(prevZoom/zoom);
  targetPos[1]=targetPos[1]*(prevZoom/zoom);

  if (moveX+regionWidth*zoom>canvasWidth){
    console.log(moveX);
    console.log(moveX-(canvasWidth-regionWidth*zoom));
    artyPos[0] += (moveX - (canvasWidth-regionWidth*zoom))/zoom;
    targetPos[0] += (moveX - (canvasWidth-regionWidth*zoom))/zoom;
    moveX = canvasWidth-regionWidth*zoom;
    console.log(moveX);
  }

  if (moveY+regionHeight*zoom>canvasHeight){
    artyPos[1] += (moveY - (canvasHeight-regionHeight*zoom))/zoom;
    targetPos[1] += (moveY - (canvasHeight-regionHeight*zoom))/zoom;
    moveY = canvasHeight-regionHeight*zoom;
  }

}
