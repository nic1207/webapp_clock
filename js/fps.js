document.addEventListener('DOMContentLoaded',onReady, false);

function onReady(){
  var mainDiv = document.createElement("div");
  mainDiv.id = 'FPSDiv';
  document.body.appendChild(mainDiv);
  var mainCanvas = document.createElement("canvas");
  mainCanvas.width="120";
  mainCanvas.height="75";
  mainCanvas.id="FPSCanvas";
  
  if(!mainCanvas.getContext)return;
  mainDiv.appendChild(mainCanvas);
  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || setTimeout; 
  var mainContext = mainCanvas.getContext('2d'); // the drawing context of the on-screen canvas element 
  var frameDuration = 33; // the animation's speed in milliseconds
  var lastPaintCount = 0; // stores the last value of mozPaintCount sampled
  var paintCountLog = []; // an array containing all measured values of mozPaintCount over time
  var speedLog = []; // an array containing all the execution speeds of main(), measured in milliseconds
  var fpsLog = []; // an array containing the calculated frames per secong (fps) of the script, measured by counting the calls made to main() per second
  var frameCount = 0; // counts the number of times main() is executed per second.
  var frameStartTime = 0; // the last time main() was called
		
  init();
		
  // Called when the video starts playing. Sets up all the javascript objects required to generate the canvas animation and measure perfomance
  function init() {
    //console.log("init()");
    fpsLog = [];
    paintCountLog = [];
    if( window.mozPaintCount ){ lastPaintCount = window.mozPaintCount;}
    speedLog = [];
    frameCount = 0;
    frameStartTime = 0;
    main();
    setTimeout(getStats,1000);
  }
		
  // As the scripts main function, it controls the pace of the animation
  function main() {
    //console.log("main()");
    //console.log(mainCanvas);
    requestAnimationFrame(main, mainCanvas);
    var now = new Date().getTime();
    
    if( frameStartTime ) {
      var sl = now - frameStartTime;
      //console.log("Render Time=",sl);
      speedLog.push(sl);
    }
    frameStartTime = now;
    frameCount++;
    mainContext.clearRect( 0, 0, mainCanvas.width, mainCanvas.height); //clear the offscreen canvas
    drawStats();
  }
  
  // This function is called every second, and it calculates and stores the current frame rate
  function getStats() {
    //console.log("*****************getstat()");
    if( window.mozPaintCount) {
      //this property is specific to firefox, and tracks how many times the browser has rendered the window since the document was loaded
      //console.log("mozPaintCount");
      var pcl = window.mozPaintCount - lastPaintCount;
      //console.log("browser fps=",pcl);
      paintCountLog.push(pcl);
      lastPaintCount = window.mozPaintCount;
    }
    //console.log("canvas fps=",frameCount);
    fpsLog.push(frameCount);
    frameCount = 0;
    setTimeout(getStats,1000);
  }
  
  //updates the bottom-right potion of the canvas with the latest perfomance statistics
  function drawStats( average ) {
    var x = 0, y = 0, graphScale = 0.8;
    mainContext.save();
    mainContext.font = "normal 10px monospace";
    mainContext.textAlign = 'left';
    mainContext.textBaseLine = 'top';
    mainContext.fillStyle = 'black';
    mainContext.fillRect( x, y, 120, 75 );
    //draw the x and y axis lines of the graph
    y += 30;
    x += 10;
    mainContext.beginPath();
    mainContext.strokeStyle = '#888';
    mainContext.lineWidth = 1.5;
    mainContext.moveTo( x, y );
    mainContext.lineTo( x + 100, y );
    mainContext.stroke();
    mainContext.moveTo( x, y );
    mainContext.lineTo( x, y - 25 );
    mainContext.stroke();
			
    // draw the last 50 speedLog entries on the graph
    mainContext.strokeStyle = 'Purple';
    mainContext.fillStyle = 'Purple';
    mainContext.lineWidth = 1.5;
    var imax = speedLog.length;
    var i = ( speedLog.length > 50 )? speedLog.length - 50 : 0;
    mainContext.beginPath();
    for( var j = 0; i < imax; i++, j += 2 ) {
      mainContext.moveTo( x + j, y );
      mainContext.lineTo( x + j, y - speedLog[i] * graphScale );
    }
    mainContext.stroke();
    // the red line, marking the desired maximum rendering time
    mainContext.beginPath();
    mainContext.strokeStyle = '#FF0000';
    mainContext.lineWidth = 1;
    var target = y - frameDuration * graphScale;
    mainContext.moveTo( x, target );
    mainContext.lineTo( x + 100, target );
    mainContext.stroke();
			
    // current/average speedLog items
    y += 12;
    if( average ) {
      var speed = 0;
      for( i in speedLog ){ speed += speedLog[i]; }
      speed = Math.floor( speed / speedLog.length * 10) / 10;
    }else {
      speed = speedLog[speedLog.length-1];
    }
    mainContext.fillStyle = 'orange';
    mainContext.fillText( 'Render Time: ' + speed, x, y );
			
    // canvas fps
    y += 12;
    if( average ) {
      fps = 0;
      for( i in fpsLog ){ fps += fpsLog[i]; }
      fps = Math.floor( fps / fpsLog.length * 10) / 10;
    }else {
      fps = fpsLog[fpsLog.length-1];
    }
    mainContext.fillStyle = 'yellow';
    mainContext.fillText( ' Canvas FPS: ' + fps, x, y );
    
    // browser frames per second (fps), using window.mozPaintCount (firefox only)
    if( window.mozPaintCount ) {
      y += 12;
      if( average ) {
        fps = 0;
        for( i in paintCountLog ){ fps += paintCountLog[i];}
        fps = Math.floor( fps / paintCountLog.length * 10) / 10;
      } else {
        fps = paintCountLog[paintCountLog.length-1];
      }
      mainContext.fillStyle = 'white';
      mainContext.fillText( 'Browser FPS: ' + fps, x, y );
    }
    mainContext.restore();
    
  }
};