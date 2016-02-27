var p5 = require('p5');

var windSimulator = function( p ) {
  var particleHolder = [];
  var PARTICLES=2000;
  var scaler=0.008;
  var distort=0.05;
  p.speed = 5.0;
  p.angle = 0.0;
  var offset=0.0;

  p.setup = function() {
    p.createCanvas(500, 500);
    p.frameRate(40);
    for (var i = 0; i < PARTICLES; i++) {
      particleHolder[i] = new Particle(200,200);
    }
    p.stroke(255);
    p.strokeWeight(1);
    p.pixelDensity(1);
  }


  p.draw = function() {
    p.fill(95, 190, 215,50);
    p.rect(0,0,p.width,p.height);
    p.fill(255);
    if(p.mouseIsPressed) {
      for (var i = 0; i < 20; i++) {
        particleHolder[Math.round(p.random(particleHolder.length-1))].moveTo(p.mouseX+p.random(-25,25),p.mouseY+p.random(-25,25));
      }
    }
    offset+=distort;
    for (var i = 0; i < particleHolder.length; i++) {
      particleHolder[i].move();
      particleHolder[i].render();
    }
  }

  function Particle(_x,_y) {
    this.x = p.random(0,500);
    this.y = p.random(0,500);
    this.prevx = this.x;
    this.prevy = this.y;
  }

  Particle.prototype.move = function() {
    this.prevx = this.x;
    this.prevy = this.y;
    var ang = ((Math.PI*2.0))*p.noise(0+(this.x*scaler),offset+(this.y*scaler));
    // ang +=  p.map(p.mouseX,0,500,0.0,6.0);
    // speed = p.map(p.mouseY,0,500,0.0,20.0);
    ang += p.angle;
    this.x += p.speed * Math.cos(ang+p.random());
    this.y += p.speed * Math.sin(ang+p.random());

    if(this.x < -5){ this.x = p.width+4; this.prevx = this.x; this.y = p.random(0,500) ; this.prevy = this.y}
    if(this.y < -5){ this.y = p.height+4;this.prevy = this.y; this.x = p.random(0,500) ; this.prevx = this.x}
    if(this.x > p.width+5){ this.x = -4 ;this.prevx = this.x; this.y = p.random(0,500) ; this.prevy = this.y}
    if(this.y > p.height+5){ this.y = -4 ;this.prevy = this.y; this.x = p.random(0,500) ;this.prevx = this.x}

  }

  Particle.prototype.moveTo = function(_x,_y) {
    this.x = _x;
    this.y = _y;
  }

  Particle.prototype.render = function() {
    p.line(this.x,this.y,this.prevx,this.prevy)
  }
}

module.exports = function (id) {
    return new p5(windSimulator,id);
};
