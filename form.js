// Put default values in the text input boxes
document.getElementById("altitude").value = Scenario.Burn.altitude;
document.getElementById("burn_time").value = Scenario.Burn.duration;
document.getElementById("thrust").value = Scenario.Burn.thrust;
document.getElementById("drag_coeff").value = Scenario.Rocket.Cd;
document.getElementById("density").value = Scenario.Site.rho;
document.getElementById("init_velocity").value = Scenario.Site.start_vel;
document.getElementById("gravity").value = Scenario.Site.g;
document.getElementById("init_altitude").value = Scenario.Site.start_alt;
document.getElementById("mass").value = Scenario.Rocket.mass;

var planets = {
  earth: {
    init_velocity: 300,
    drag_coeff: 0.3,
    density: 1.3,
  },
  moon: {
    init_velocity: 300,
    drag_coeff: 0.3,
    density: 0,
  },
  mars: {
    init_velocity: 300,
    drag_coeff: 0.3,
    density: 0.13,
  },
  terraformedMars: {
    init_velocity: 300,
    drag_coeff: 0.3,
    density: 1.0,
  },
  venus: {
    init_velocity: 300,
    drag_coeff: 0.3,
    density: 5.0,
  },

};

function process_form(form) {

  var inputs = form.getElementsByTagName("input");
  // Parse user input
  var num_values = {};
  for (var i = 0; i < inputs.length; i++) {
    if(inputs[i].type != "text") {
        continue;
    }
    num_values[inputs[i].name] = Number(inputs[i].value);
  }

  // Rocket controls
  Scenario.Burn.altitude = num_values['altitude'];
  Scenario.Burn.duration = num_values['burn_time'];
  Scenario.Burn.thrust = num_values['thrust'];
  Scenario.Burn.Cd = num_values['drag_coeff'];
  Scenario.Burn.rho = num_values['density'];
  Scenario.Burn.start_vel = num_values['init_velocity'];
  Scenario.Burn.g = num_values['gravity'];
  Scenario.Burn.start_alt = num_values['init_altitude'];
  Scenario.Burn.mass = num_values['mass'];

  init();

  return false;
}
