// Matter.js module aliases
var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Sleeping = Matter.Sleeping,
  Events = Matter.Events;

// create a Matter.js engine
var engine = Engine.create({
  render: {
    element: document.getElementById("target"),
    options: {
      width: 800,
      height: 600,
      hasBounds: true,
      wireframes: false,
    }
  }
});

// global constants
var impactVelocityThreshold = 15.; // extremely arbitrary
var bgImageUrl = "img/stars.jpg";
var staticRocketSprite = "img/static_rocket.png";
var fieryRocketSprite =  "img/fiery_rocket.png";
var explosionSprite = "img/boom.png";

// preload the background image
var imageObj = new Image();
imageObj.src = bgImageUrl;

// create two rockets
var rocket1 = Bodies.rectangle(300, 350, 25, 72);
var rocket2 = Bodies.rectangle(500, 350, 25, 72);

// Initial conditions
var init_velocity = {x: 0, y: 20};
var rho = 1.3;
engine.world.gravity.y = 1;
var drag_coeff = 0.3;

function initRockets() {
  Body.setPosition(rocket1, {x: 300, y: 350});
  rocket1.render.sprite.texture = staticRocketSprite;
  rocket1.render.sprite.xScale = 1.;
  rocket1.render.sprite.yScale = 1.;
  rocket1.state = "fall";
  Sleeping.set(rocket1, false);
  Body.setAngularVelocity(rocket1, 0.2);
  Body.setVelocity(rocket1, init_velocity);
  Body.setVelocity(rocket2, init_velocity);

  Body.setPosition(rocket2, {x: 500, y: 350});
  rocket2.render.sprite.texture = staticRocketSprite;
  rocket2.render.sprite.xScale = 1.;
  rocket2.render.sprite.yScale = 1.;
  rocket2.state = "start";
  Sleeping.set(rocket2, false);

  rocket1.drag_coeff = drag_coeff;
  rocket1.drag_area = 0.00001;
  rocket2.drag_coeff = drag_coeff;
  rocket2.drag_area = 0.00001;
  burn_y = ground_top - burn_alt;
}


initRockets();

// 1600 are 2560 are height and width of the background image
var groundWidth = 10
var ground = Bodies.rectangle(0, 1600-2*groundWidth, 2500, groundWidth, {
  isStatic: true
});
ground.render.fillStyle = "#4d2600";
ground.render.strokeStyle = "#4d2600";


// add all of the bodies to the world
World.add(engine.world, [rocket1, rocket2, ground]);

// Control variables
var burn_duration = 1.1;
var burn_alt = 600;
var burn_thrust = 0.003;



// Compute heights of things
var ground_top = ground.bounds.min.y;
var rocket_height = rocket2.bounds.max.y - rocket2.bounds.min.y;
var burn_y = ground_top - burn_alt;

function applyDrag(rocket) {
    var F = 0.5 * rho * rocket.velocity.y * rocket.velocity.y * rocket.drag_coeff * rocket.drag_area * -Math.sign(rocket.velocity.y);
    Body.applyForce(rocket, rocket.position, {x: 0, y: F});
}

Events.on(engine, 'beforeUpdate', function() {
  applyDrag(rocket1);

  if (rocket2.state === "start") {
    applyDrag(rocket2);
    if (rocket2.position.y > burn_y) {
      rocket2.burn_start_time = engine.timing.timestamp;
      rocket2.state = "burn";
      rocket2.render.sprite.texture = fieryRocketSprite;
    }
  } else if (rocket2.state === "burn") {
    applyDrag(rocket2);
    if (engine.timing.timestamp - rocket2.burn_start_time >= burn_duration * 1000) {
      rocket2.state = "fall";
      rocket2.render.sprite.texture = staticRocketSprite;
    } else {
      Body.applyForce(rocket2, rocket2.position, {
        x: 0,
        y: -burn_thrust
      });
    }
  } else if (rocket2.state === "fall") {
    applyDrag(rocket2);
  } else if (rocket2.state === "land") {
  }
});

var initialEngineBoundsMaxX = engine.render.bounds.max.x,
  initialEngineBoundsMaxY = engine.render.bounds.max.y,
  centerOffsetX = (engine.render.bounds.min.x - engine.render.bounds.max.x) / 2,
  centerOffsetY = (engine.render.bounds.min.y - engine.render.bounds.max.y) / 2;

function resetCamera(hero) {
  engine.render.bounds.min.x = centerOffsetX + hero.bounds.min.x;
  engine.render.bounds.max.x = centerOffsetX + hero.bounds.min.x + initialEngineBoundsMaxX;
  engine.render.bounds.min.y = centerOffsetY + hero.bounds.min.y;
  engine.render.bounds.max.y = centerOffsetY + hero.bounds.min.y + initialEngineBoundsMaxY;
}

var hero = rocket2;

// this function will be called roughly 60 times per second
Events.on(engine, 'beforeUpdate', function(event) {
  // Follow Hero X
  engine.render.bounds.min.x = centerOffsetX + hero.bounds.min.x;
  engine.render.bounds.max.x = centerOffsetX + hero.bounds.min.x + initialEngineBoundsMaxX;

  // Follow Hero Y
  if (engine.render.bounds.max.y >= ground.bounds.max.y) {
    engine.render.bounds.min.y = ground.bounds.max.y - initialEngineBoundsMaxY
    engine.render.bounds.max.y = ground.bounds.max.y
  } else {
    engine.render.bounds.min.y = centerOffsetY + hero.bounds.min.y;
    engine.render.bounds.max.y = centerOffsetY + hero.bounds.min.y + initialEngineBoundsMaxY;
  }
});

Matter.Events.on(engine, 'collisionStart', function(event) {
  var collidingRocket;
  if (event.pairs[0].bodyA.isStatic) {
    collidingRocket = event.pairs[0].bodyB;
  } else {
    collidingRocket = event.pairs[0].bodyA;
  }

  if(collidingRocket.state === 'fall' || collidingRocket.state === 'burn') {
    if (collidingRocket === rocket1) {
      document.getElementById("stats").innerHTML += "<br>rocket1 impact velocity: " + collidingRocket.speed;
    } else if (collidingRocket === rocket2) {
      document.getElementById("stats").innerHTML += "<br>rocket2 impact velocity: " + collidingRocket.speed;
    }
    collidingRocket.state = "land";
    collidingRocket.impact_velocity = rocket2.speed;
  }

  if (collidingRocket.speed >= impactVelocityThreshold) {
    collidingRocket.render.sprite.texture = explosionSprite;

    Body.setAngle(collidingRocket, 0);
    Sleeping.set(collidingRocket, true);

    collidingRocket.render.sprite.xScale = 0.15;
    collidingRocket.render.sprite.yScale = 0.75;
  }

});

Events.on(engine.render, "afterRender", function(event) {
  engine.render.context.globalCompositeOperation = 'destination-over';

  //draw cropped background on the whole canvas
  var destX = 0;
  var destY = 0;
  var destWidth = engine.render.canvas.width;
  var destHeight = engine.render.canvas.height;

  // by cropping the source rectangle
  var sourceX = engine.render.bounds.min.x;
  var sourceY = engine.render.bounds.min.y;
  var sourceWidth = destWidth;
  var sourceHeight = destHeight;

  engine.render.context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
  engine.render.context.globalCompositeOperation = 'source-over';
});

// run the engine
Engine.run(engine);
