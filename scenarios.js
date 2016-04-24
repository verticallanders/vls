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
  "WIL": {
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
    double_trouble: true,
    yOffset: 0,
  },
  
  // to make this land use "Burn altitute: 220; Burn time: 1.3"
  "Falcon 9": {
    mass: 30000,
    area: Math.PI * 3.66,
    height: 72,
    width: 4,
    Cd: 0.8,
    survivable_velocity: 15,
    max_thrust: 6806000,
    sprite_normal: "img/static_falcon.png",
    sprite_burning: "img/fiery_falcon.png",
    sprite_broken: "img/boom.png",
    thumbnail: "img/static_falcon.png",
    yOffset: 0.125,
  },
  
  "Saturn V": {
    mass: 130000,
    area: Math.PI * 10.1,
    height: 116,
    width: 10,
    Cd: 0.8,
    survivable_velocity: 15,
    max_thrust: 1000000,
    sprite_normal: "img/static_saturn.png",
    sprite_burning: "img/fiery_saturn.png",
    sprite_broken: "img/boom.png",
    thumbnail: "img/static_saturn.png",
    yOffset: 0,
  },
  
  "Ariane 5": {
    mass: 20000,
    area: Math.PI * 5.4,
    height: 52,
    width: 5,
    Cd: 0.8,
    survivable_velocity: 15,
    max_thrust: 960000,
    sprite_normal: "img/static_ariane.png",
    sprite_burning: "img/fiery_ariane.png",
    sprite_broken: "img/boom.png",
    thumbnail: "img/static_ariane.png",
    yOffset: 0.16,
  },
  
  "Proton M": {
    mass: 30600,
    area: Math.PI * 7.4,
    height: 58,
    width: 8,
    Cd: 0.8,
    survivable_velocity: 15,
    max_thrust: 613000,
    sprite_normal: "img/static_proton.png",
    sprite_burning: "img/fiery_proton.png",
    sprite_broken: "img/boom.png",
    thumbnail: "img/static_proton.png",
    yOffset: 0.15,
  },
};
