

let activeRegionImage;
let artyPos = [0,0];
let targetPos = [0,0];
let spotterPos = [0,0];

let circleSize = 7;
let moveState = 0;
function preload() {

}
function changeRegion(){
  path = document.getElementById("regionSelect").options[document.getElementById("regionSelect").selectedIndex].value;
  activeRegionImage = loadImage(path);
}

function setup() {
  Height = 1050;
  Width  = 1200;
  activeRegionImage = loadImage('https://i.imgur.com/TRl8sds.png')
  canvas = createCanvas(Height, Width);
  canvas.parent('sketch-holder');
}

function dis(x1,y1,x2,y2) {
    return sqrt((x1-x2)**2+(y1-y2)**2)
}

function px2m(numb){
  return numb*2;
}

function getAngle(y,x){
  angle = Math.atan2(y,x)*180/Math.PI
  console.log(angle)
  if (angle < 0) {
    angle = 360+angle;
  }
  return angle
}
function saveSettings() {
  showVector = document.getElementById("vectorCheckbox").checked
  OBList[activePlanet].image =  document.getElementById("planetSkinsSelect").options[document.getElementById("planetSkinsSelect").selectedIndex].value;
  document.getElementById("activePlanetPic").src = planetSkinsRaw[OBList[activePlanet].image];
  timeRatio = document.getElementById("timescaleBox").value*60
  document.getElementById("timescaleSlider").value = document.getElementById("timescaleBox").value
  CollisionFlag = document.getElementById("colissionCheckbox").checked
  OBList[activePlanet].radius = document.getElementById("radiusBox").value
  document.getElementById("radiusSlider").value = document.getElementById("radiusBox").value
  OBList[activePlanet].mass = document.getElementById("massBox").value*Math.pow(10,document.getElementById("massExponentBox").value)
  if (speedChangeFlag) {
    OBList[activePlanet].speedx = convert.disRTG(document.getElementById("speedxBox").value)*Math.pow(10,document.getElementById("speedxExponentBox").value)
    OBList[activePlanet].speedy = convert.disRTG(document.getElementById("speedyBox").value)*Math.pow(10,document.getElementById("speedyExponentBox").value)
    speedChangeFlag = false;
  }
  trailList[activePlanet].trailLength = document.getElementById("trailLengthBox").value
  trailList[activePlanet].trailOn = document.getElementById("trailCheckbox").checked
}

function draw() {
  clear();
  image(activeRegionImage,0, 0)
  //Are any of the circles being placed
  if (moveState == 1) {artyPos = [mouseX,mouseY]}
  else if (moveState == 2) {targetPos = [mouseX,mouseY]}
  else if (moveState == 3) {spotterPos = [mouseX,mouseY]}

  fill('#2f7a04');
  circle(artyPos[0], artyPos[1], circleSize);//Artillery
  fill('#ab0011');
  circle(targetPos[0], targetPos[1], circleSize);//Target
  fill('#98a300');
  circle(spotterPos[0], spotterPos[1], circleSize);//Spotter
  document.getElementById("distanceP").innerHTML = "Distance: " + str(int(px2m(dis(targetPos[0],targetPos[1],artyPos[0],artyPos[1]))))+" m"
  document.getElementById("azimuthP").innerHTML = "Distance: " + str(getAngle(targetPos[1]-artyPos[1], targetPos[0]-artyPos[0])) + " deg"
}

function mousePressed(){
  console.log([mouseX,mouseY])
  moveState = 0;
}
