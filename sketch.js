"use strict";
let myShaders = [];
let myTextures = [];
let numTextures = 8;

function preload() {
  // load the shader multiple times
  for (let i = 0; i < numTextures; i++) {
    var s0 = loadShader('./shader.vert', './shader.frag')
    myShaders.push(s0);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  const dim = min(width, height);
  for (let i = 0; i < numTextures; i++) {
    myTextures.push(createGraphics(dim, dim, WEBGL));
  }
  setAttributes('antialias', true);
  
 // Fix for easyCam
	
  Dw.EasyCam.prototype.apply = function(n) {
		var o = this.cam;
		n = n || o.renderer,
			n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
	};
  
	cam = createEasyCam()
	cam.zoom(5)
}


function draw(){
  background(22);
  noStroke();
  
  ambientLight(50);
  directionalLight(200,200,200, -1,-1,-1);
  pointLight(200,200,200,0,50,150);
  
//specularMaterial(280,10);
//  orbitControl();
  const dim = min(width, height)

  for (let i = 0; i < numTextures; i++) {
    const time = millis() / 1000.0;
    myTextures[i].shader(myShaders[i]);
    myTextures[i].rect(0, 0, dim, dim);

    myShaders[i].setUniform('u_resolution', [dim, dim]);
    myShaders[i].setUniform('u_time', time);
    myShaders[i].setUniform('u_layer', i);
  }

  const yStep = 40;
  translate(0, -yStep * numTextures * 0.5, 0);

  const sz = 150;
  for (let i = 0; i < numTextures; i++) {
    texture(myTextures[i]);
    quad(
      -sz, 0, sz,
      sz, 0, sz,
      sz, 0, -sz,
      -sz, 0, -sz,
    )
    translate(0, 40, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
