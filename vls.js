// Will It Land?
// Simulator Engine

// Our configuration
var Scenario = {

  Site: {
    // Landing site atmospheric density, kg/m³
    rho: 1.3,

    // Landing site gravitational acceleration, m/s/s
    g: 9.81,

    // Landing site initial altitude, metres above ground level
    // Must be less than the background image height.
    start_alt: 1000,

    // Landing site initial velocity, m/s
    start_vel: 300,

    // Landing site background image
    bg_img: "img/stars.jpg",

    // Landing site background image width
    bg_img_w: 2560,

    // Landing site background image height
    bg_img_h: 1600,

    // Landing site ground fill (colour or CSS image)
    ground_fill: "#4d2600",
  },

  Rocket: {
    // Rocket mass, kg
    mass: 30000,

    // Rocket frontal surface area, for drag purposes, m²
    area: Math.PI * 3.66,

    // Rocket height, for display purposes, m
    height: 72,

    // Rocket width, for display purposes, m
    width: 25,

    // Rocket drag coefficient
    Cd: 0.3,

    // Rocket maximum survival velocity
    survivable_velocity: 15,

    // Rocket maximum thrust, newtons
    max_thrust: 6806000,

    // Rocket sprite, normal condition
    sprite_normal: "img/static_rocket.png",

    // Rocket sprite, burning condition
    sprite_burning: "img/fiery_rocket.png",

    // Rocket sprite, broken condition
    sprite_broken: "img/boom.png",
    
    yOffset: 0,
  },

  Burn: {
    // Burn start altitude, metres above ground level
    altitude: 260,

    // Burn duration, seconds
    duration: 1.4,

    // Thrust, percentage full power
    thrust: 100,
  },
};

// End of configuration.

// Matter.js module aliases
var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Sleeping = Matter.Sleeping,
  Vector = Matter.Vector,
  Events = Matter.Events;

// Create Matter.js engine
var engine = Engine.create({
  render: {
    element: document.getElementById("target"),
    options: {
      width: document.getElementById("target").clientWidth || 800,
      height: 600,
      background: '#000',
      hasBounds: true,
      wireframes: false,
      showSleeping: false,
    }
  }
});

// Helper functions to turn internal velocities into m/s
// NB assumes timeDelta is 1000/60
function fixv(velocity) {
  return Vector.mult(velocity, 60);
}
function invfixv(velocity) {
  return Vector.div(velocity, 60);
}

// Store the background image
var siteBgImg = new Image();

// Store the two rockets and the ground
var rocket1, rocket2, ground;

// Record initial camera bounds
var initialEngineBoundsMaxX = engine.render.bounds.max.x,
  initialEngineBoundsMaxY = engine.render.bounds.max.y,
  centerOffsetX = (engine.render.bounds.min.x - engine.render.bounds.max.x)/2,
  centerOffsetY = (engine.render.bounds.min.y - engine.render.bounds.max.y)/2;

// Initialise the Site
function initSite() {

  // Load background image
  siteBgImg.src = Scenario.Site.bg_img;

  // Create the ground
  ground = Bodies.rectangle(0, Scenario.Site.bg_img_h+50,
    Scenario.Site.bg_img_w*2, 100, {isStatic: true});
  ground.render.fillStyle = Scenario.Site.ground_fill;
  ground.render.strokeStyle = "rgba(0,0,0,0)";

  // Set gravity
  engine.world.gravity.y = Scenario.Site.g;
  engine.world.gravity.scale = 1e-6;
}

// Initialise the rockets
function initRockets() {
  rocket1 = Bodies.rectangle(300,
    Scenario.Site.bg_img_h - Scenario.Site.start_alt,
    Scenario.Rocket.width, Scenario.Rocket.height);
  rocket2 = Bodies.rectangle(500,
    Scenario.Site.bg_img_h - Scenario.Site.start_alt,
    Scenario.Rocket.width, Scenario.Rocket.height);

  Body.setAngle(rocket1, 0);
  Body.setAngle(rocket2, 0);

  var vel = {x: 0, y: Scenario.Site.start_vel};
  Body.setVelocity(rocket1, invfixv(vel));
  Body.setVelocity(rocket2, invfixv(vel));

  Body.setMass(rocket1, Scenario.Rocket.mass);
  Body.setMass(rocket2, Scenario.Rocket.mass);

  Body.setAngularVelocity(rocket1, 0.2);

  rocket1.frictionAir = 0;
  rocket2.frictionAir = 0;

  rocket1.render.sprite.texture = Scenario.Rocket.sprite_normal;
  rocket2.render.sprite.texture = Scenario.Rocket.sprite_normal;
  rocket1.render.sprite.xScale = 1;
  rocket2.render.sprite.xScale = 1;
  rocket1.render.sprite.yScale = 1;
  rocket2.render.sprite.yScale = 1;

  rocket1.render.sprite.yOffset = rocket1.render.sprite.yOffset + Scenario.Rocket.yOffset;
  rocket2.render.sprite.yOffset = rocket2.render.sprite.yOffset + Scenario.Rocket.yOffset;;

  rocket1.state = "fall";
  rocket2.state = "start";

  rocket1.height = rocket1.bounds.max.y - rocket1.bounds.min.y;
  rocket2.height = rocket2.bounds.max.y - rocket2.bounds.min.y;

  // Reset the camera to watch the new rocket
  engine.render.bounds.min.x = centerOffsetX + rocket2.bounds.min.x;
  engine.render.bounds.max.x = centerOffsetX + rocket2.bounds.min.x + initialEngineBoundsMaxX;
  engine.render.bounds.min.y = centerOffsetY + rocket2.bounds.min.y;
  engine.render.bounds.max.y = centerOffsetY + rocket2.bounds.min.y + initialEngineBoundsMaxY;
}

// Initialise the scenario
function init() {
  World.clear(engine.world);
  document.getElementById("stats").innerHTML = "";
  initSite();
  initRockets();
  World.add(engine.world, [rocket1, rocket2, ground]);
}

// Apply drag forces to a rocket
function applyDrag(rocket) {
   var F = 0.5
     * Scenario.Site.rho
     * fixv(rocket.velocity).y * fixv(rocket.velocity).y
     * Scenario.Rocket.Cd
     * Scenario.Rocket.area
     * -Math.sign(rocket.velocity.y);
   Body.applyForce(rocket, rocket.position, {x: 0, y: F * 1e-6});
}

// Run a rocket through the falling-burning-falling-landing states
function rocketStateMachine(rocket) {
  if(rocket.state == "start") {
    // In the start state, we fall until we reach the altitude
    // to start burning at, then we log that time and swap to burn.
    //
    applyDrag(rocket);
    var burn_start = Scenario.Site.bg_img_h - Scenario.Burn.altitude;
    if(rocket.position.y > burn_start) {
      rocket.burn_start_time = engine.timing.timestamp;
      rocket.state = "burn";
      rocket.render.sprite.texture = Scenario.Rocket.sprite_burning;
    }

  } else if(rocket.state == "burn") {
    // In the burn state, we fall while applying burn thrust until
    // we run out of burn time, then we go to the fall state.
    //
    applyDrag(rocket);
    var burn_t = Scenario.Burn.duration * 1000;
    if(engine.timing.timestamp - rocket.burn_start_time >= burn_t) {
      //rocket.state = "fall";
      rocket.render.sprite.texture = Scenario.Rocket.sprite_normal;
    } else {
      var f = Scenario.Burn.thrust/100 * Scenario.Rocket.max_thrust;
      Body.applyForce(rocket, rocket.position, {x: 0, y: -f * 1e-6});
      rocket.render.sprite.texture = Scenario.Rocket.sprite_burning;
    }

  } else if(rocket.state == "fall") {
    // In the fall state we just fall until the collision handler
    // detects us hitting the ground and swaps us to the land state.
    applyDrag(rocket);
    rocket.render.sprite.texture = Scenario.Rocket.sprite_normal;

  } else if(rocket.state == "land") {
    // We don't really do anything in the landed state.
  }
}

// Update the camera to follow the given rocket
function followCam(rocket) {
  // Update X position
  engine.render.bounds.min.x = centerOffsetX + rocket.bounds.min.x;
  engine.render.bounds.max.x = centerOffsetX + rocket.bounds.min.x + initialEngineBoundsMaxX;

  // Update Y position, clipping to the ground
  if (engine.render.bounds.max.y >= ground.bounds.max.y) {
    engine.render.bounds.min.y = ground.bounds.max.y - initialEngineBoundsMaxY
    engine.render.bounds.max.y = ground.bounds.max.y
  } else {
    engine.render.bounds.min.y = centerOffsetY + rocket.bounds.min.y;
    engine.render.bounds.max.y = centerOffsetY + rocket.bounds.min.y + initialEngineBoundsMaxY;
  }
}

document.onkeydown = function(e) {
    if(e.keyCode == 32 && (rocket2.state == "start" || rocket2.state == "fall")) {
      rocket2.state = "burn";
      rocket2.render.sprite.texture = Scenario.Rocket.sprite_burning;
    }
}
document.onkeyup = function(e) {
    if(e.keyCode == 32 && rocket2.state == "burn") {
        rocket2.state = "fall";
      rocket2.render.sprite.texture = Scenario.Rocket.sprite_normal;
    }
}

// Handle a collision with a rocket and the ground.
// If the rocket is not landed, land it.
// If the rocket landed too quickly, destroy it.
function handleCollision(rocket) {
  if(rocket.state == "land") {
    return;
  }

  // Update the status text
  if (rocket === rocket1) {
    document.getElementById("stats").innerHTML +=
      "<br>Tumbling rocket impact velocity: "
      + Math.round(fixv(rocket.velocity).y);
  } else if (rocket === rocket2) {
    document.getElementById("stats").innerHTML +=
      "<br>Burning rocket impact velocity: "
      + Math.round(fixv(rocket.velocity).y);
  }

  // Land the rocket
  rocket.state = "land";
  Sleeping.set(rocket, true);

  // Explode overly fast rockets
  if (fixv(rocket.velocity).y >= Scenario.Rocket.survivable_velocity) {
    Body.setAngle(rocket, 0);
    rocket.render.sprite.texture = Scenario.Rocket.sprite_broken;
    rocket.render.sprite.xScale = 0.15;
    rocket.render.sprite.yScale = 0.75;
    rocket.render.sprite.yOffset = rocket.render.sprite.yOffset - Scenario.Rocket.yOffset;
  }
}

// Runs every engine update, roughly 60 fps.
// Just put drag on the left rocket, run the right through the states.
// Update camera position to follow the rocket.
Events.on(engine, 'beforeUpdate', function() {
  applyDrag(rocket1);
  rocketStateMachine(rocket2);
  followCam(rocket2);
});

// Runs every time a collision is detected.
// We'll step through all detected colliding pairs, detect which one is
// the rocket, and handle it.
Events.on(engine, 'collisionStart', function(event) {
  for(var i=0; i<event.pairs.length; i++) {
    if(event.pairs[i].bodyA === rocket1 || event.pairs[i].bodyA === rocket2) {
      handleCollision(event.pairs[i].bodyA);
    } else {
      handleCollision(event.pairs[i].bodyB);
    }
  }
});

// Render the background image
Events.on(engine.render, "afterRender", function(event) {
  engine.render.context.globalCompositeOperation = 'destination-over';

  // Draw cropped background on the whole canvas
  var destX = 0;
  var destY = 0;
  var destWidth = engine.render.canvas.width;
  var destHeight = engine.render.canvas.height;

  // ...by cropping the source rectangle
  var sourceX = engine.render.bounds.min.x;
  var sourceY = engine.render.bounds.min.y;
  var sourceWidth = destWidth;
  var sourceHeight = destHeight;

  if(sourceY < 0) {
    destY = -sourceY;
    sourceY = 0;
  }

  engine.render.context.drawImage(siteBgImg, sourceX, sourceY,
    sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
  engine.render.context.globalCompositeOperation = 'source-over';
});
