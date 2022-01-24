

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
console.log(px2mconst)
let circleSize = 7;
let moveState = 0;

let minRange = 0;
let maxRange = 0;

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
  clear();
  image(activeRegionImage,0, 0,regionWidth,regionHeight)
  //Are any of the circles being placed
  if (moveState == 1) {artyPos = [mouseX,mouseY];artyDrawFlag = true}
  else if (moveState == 2) {targetPos = [mouseX,mouseY];targetDrawFlag = true}
  else if (moveState == 3) {spotterPos = [mouseX,mouseY];spotterDrawFlag = true}

  if (artyDrawFlag){
    fill('#2f7a04');
    circle(artyPos[0], artyPos[1], circleSize);
    if (document.getElementById("rangeToggle").checked){
      fill(255, 255, 255, 0);
      circle(artyPos[0], artyPos[1], m2px(minRange)*2);
      circle(artyPos[0], artyPos[1], m2px(maxRange)*2);
    }
  }//Artillery
  if (targetDrawFlag){
  fill('#ab0011');
  circle(targetPos[0], targetPos[1], circleSize);}//Target
  if (spotterDrawFlag){
  fill('#98a300');
  circle(spotterPos[0], spotterPos[1], circleSize);}//Spotter
  document.getElementById("distanceP").innerHTML = "Distance: " + str(int(px2m(dis(targetPos[0]-windBias[0],targetPos[1]-windBias[1],artyPos[0],artyPos[1]))))+" m"
  document.getElementById("azimuthP").innerHTML = "Azimuth: " + str(Math.round(getAngle(targetPos[1]-windBias[1]-artyPos[1], targetPos[0]-windBias[0]-artyPos[0])*10)/10) + " deg"
}

function mousePressed(){
  moveState = 0;
}
