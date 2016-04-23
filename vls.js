var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine = Engine.create(document.body);
var rocket_bod = Bodies.rectangle(400, 600, 50, 200);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

World.add(engine.world, [rocket_bod, ground]);
Engine.run(engine);
