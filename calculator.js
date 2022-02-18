

let activeRegionImage;
let uploadActiveRegionImage;
let gridImage;
let artyPos = [0,0];
let targetPos = [0,0];
let spotterPos = [0,0];

let windStrength = 0
let windAngle = 0
let windBias = [0,0]

let spotterBased = false;
let resizeCanvasFlag = false;
let usingCustomRegion = false;
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

let gridXnumb = 18;
let gridYnumb = 15;

let canvas;

function preload() {

}

function changeRegion(){
  path = document.getElementById("regionSelect").options[document.getElementById("regionSelect").selectedIndex].value;
  activeRegionImage = loadImage(path);
  regionHeight = 888;
  regionWidth  = 1024;
  resizeCanvas(regionWidth, regionHeight);
  usingCustomRegion = false;
}

function changeGun(){
  if (document.getElementById("gunSelect").selectedIndex==0) {minRange=75;maxRange=250;}//Koronides
  else if (document.getElementById("gunSelect").selectedIndex==1) {minRange=100;maxRange=300;}//Huber Lariat 120mm
  else if (document.getElementById("gunSelect").selectedIndex==2) {minRange=100;maxRange=300;}//Huber Exalt 150mm
  else if (document.getElementById("gunSelect").selectedIndex==3) {minRange=200;maxRange=350;}//50-500 “Thunderbolt” Cannon
  else if (document.getElementById("gunSelect").selectedIndex==4) {minRange=45;maxRange=80;}//Cremari Mortar
  else if (document.getElementById("gunSelect").selectedIndex==5) {minRange=400;maxRange=1000;}//Storm Cannon
  else if (document.getElementById("gunSelect").selectedIndex==6) {minRange=50;maxRange=100;}//Storm Cannon
}

function setup() {
  changeGun();
  changeRegion();
  document.getElementById("gridToggle").checked = true;
  document.getElementById("rangeToggle").checked= true;
  document.getElementById("spotterToggle").checked= false;
  gridImage = loadImage("https://albert-b-b.github.io/ArtilleryCalc/assets/RegionGrid.png")
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('sketch-holder');
  //Has to be more stable to be added to release
  //regionUploadLabel = createFileInput(imageUploadFunc);
  //regionUploadLabel.position(-20, -100);
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
}

function draw() {
  if (document.getElementById("spotterToggle").checked) {
    targetAzm = document.getElementById("spotterTargetAzm").value;
    targetDis = document.getElementById("spotterTargetDis").value;
    spotter2targetVec = [targetDis*Math.cos(targetAzm*Math.PI/180),targetDis*Math.sin(targetAzm*Math.PI/180)];
    artyAzm = document.getElementById("spotterArtyAzm").value;
    artyDis = document.getElementById("spotterArtyDis").value;
    arty2spotterVec = [artyDis*Math.cos(artyAzm*Math.PI/180),artyDis*Math.sin(artyAzm*Math.PI/180)];
    console.log(spotter2targetVec)
    document.getElementById("distanceP").innerHTML = "Distance: " + str(Math.round(int(dis(arty2spotterVec[0]+spotter2targetVec[0]-windBias[0],arty2spotterVec[1]+spotter2targetVec[1]-windBias[1],0,0))))+" m"
    document.getElementById("azimuthP").innerHTML = "Azimuth: " + str(Math.round(getAngle(spotter2targetVec[1]-windBias[1]+arty2spotterVec[1], spotter2targetVec[0]-windBias[0]+arty2spotterVec[0])*10-900)/10) + " deg"

  }
  else {
  if (moveState == 4) {
    deltaX = (mouseX-lastX)*zoom
    deltaY = (mouseY-lastY)*zoom
    moveX -= deltaX
    moveY -= deltaY
    if (usingCustomRegion == false) {
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
    else {
      artyPos[1] +=deltaY/zoom
      targetPos[1] +=deltaY/zoom
    }
  }
  lastX = mouseX
  lastY = mouseY
  clear();
  if (usingCustomRegion) {
    if (resizeCanvasFlag && uploadActiveRegionImage.width != 0) {
      resizeCanvasFlag = false;
      regionHeight = uploadActiveRegionImage.width;
      regionWidth  = uploadActiveRegionImage.height;
      moveX = 0;
      moveY = 0;
      zoom =  1;
    }
    image(uploadActiveRegionImage,0, 0,canvasWidth,canvasHeight,moveX,moveY,regionWidth*zoom,regionHeight*zoom)
  }
  else {
    image(activeRegionImage,0, 0,canvasWidth,canvasHeight,moveX,moveY,regionWidth*zoom,regionHeight*zoom)
  }
  if (document.getElementById("gridToggle").checked){
    image(gridImage,0, 0,canvasWidth,canvasHeight,moveX,moveY,regionWidth*zoom,regionHeight*zoom)
    gridXSquare = int((moveX+mouseX*zoom+3)/(59));
    gridYSquare = int((moveY+mouseY*zoom+3)/(59));
    if (gridXSquare >= 0 && gridYSquare >=0 && gridXSquare <=17 && gridYSquare <= 15){
      text('Grid square ' +str(gridYSquare+1)+ String.fromCharCode(gridXSquare+65), 50, 75);
      strokeWeight(2);
      stroke('rgba(56,42,14,0.25)');
      for (i=1;i<3;i++){
        line((gridXSquare*59+i*59/3-moveX)/zoom, (gridYSquare*59-moveY-2)/zoom, (gridXSquare*59-moveX+i*59/3)/zoom, (gridYSquare*59+59-moveY-2)/zoom);
        line((gridXSquare*59-moveX-2)/zoom,(gridYSquare*59+i*59/3-moveY)/zoom,(gridXSquare*59+59-moveX-2)/zoom,(gridYSquare*59-moveY+i*59/3)/zoom);
      }
    }
    else {
      text('Grid square ' + "???", 50, 75);
    }
  }
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
  if (usingCustomRegion == false) {
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
      artyPos[0] += (moveX - (canvasWidth-regionWidth*zoom))/zoom;
      targetPos[0] += (moveX - (canvasWidth-regionWidth*zoom))/zoom;
      moveX = canvasWidth-regionWidth*zoom;
    }

    if (moveY+regionHeight*zoom>canvasHeight){
      artyPos[1] += (moveY - (canvasHeight-regionHeight*zoom))/zoom;
      targetPos[1] += (moveY - (canvasHeight-regionHeight*zoom))/zoom;
      moveY = canvasHeight-regionHeight*zoom;
    }
  }
}

function imageUploadFunc(file) {
  if (file.type === 'image') {
    usingCustomRegion = true;
    uploadActiveRegionImage = createImg(file.data,"Error loading image");
    uploadActiveRegionImage.hide();
    document.getElementById("gridToggle").checked = false;
    resizeCanvasFlag = true;
  }
}

function spotterInput() {
  listToShow = document.getElementsByClassName("spotterClass");
  if (document.getElementById("spotterToggle").checked) {
    for (const box of listToShow) {
      box.style.display = 'inline';
  }
  }
  else {
    for (const box of listToShow) {
      box.style.display = 'none';
  }
  }
}
