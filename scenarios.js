var sites = {
  Earth: {
    rho: 1.3,
    g: 9.81,
    start_alt: 1000,
    start_vel: 300,
    bg_img: "img/earth_bg.jpg",
    bg_img_w: 2560,
    bg_img_h: 1600,
    ground_fill: "#4d2600",
    thumbnail: "img/earth.jpg",
  },

  Moon: {
    rho: 0,
    g: 1.63,
    start_alt: 400,
    start_vel: 100,
    bg_img: "img/moon_bg.jpg",
    bg_img_w: 900,
    bg_img_h: 945,
    ground_fill: "#bbb",
    thumbnail: "img/moon.jpg",
  },

  Mars: {
    rho: 0.13,
    g: 3.71,
    start_alt: 600,
    start_vel: 200,
    bg_img: "img/mars_bg.jpg",
    bg_img_w: 1200,
    bg_img_h: 1243,
    ground_fill: "#c1440e",
    thumbnail: "img/mars.jpg",
  },

  "Terraformed Mars": {
    rho: 1.0,
    g: 3.71,
    start_alt: 600,
    start_vel: 200,
    bg_img: "img/tmars_bg.jpg",
    bg_img_w: 1200,
    bg_img_h: 960,
    ground_fill: "#68e510",
    thumbnail: "img/t-mars.png",
  },

  Venus: {
    rho: 5.0,
    g: 8.858,
    start_alt: 600,
    start_vel: 200,
    bg_img: "img/venus_bg.jpg",
    bg_img_w: 1200,
    bg_img_h: 960,
    ground_fill: "#964911",
    thumbnail: "img/venus.png",
  },
};

var rockets = {
  "Falcon 9": {
    mass: 30000,
    area: Math.PI * 3.66,
    height: 72,
    width: 25,
    Cd: 0.3,
    survivable_velocity: 15,
    max_thrust: 6806000,
    sprite_normal: "img/static_rocket.png",
    sprite_burning: "img/fiery_rocket.png",
    sprite_broken: "img/boom.png",
    thumbnail: "img/static_rocket.png",
  },
};
