// Put default values in the text input boxes
document.getElementById("altitude").value = burn_alt;
document.getElementById("burn_time").value = burn_duration;
document.getElementById("thrust").value = burn_thrust;
document.getElementById("drag_coeff").value = drag_coeff;
document.getElementById("density").value = rho;
document.getElementById("init_velocity").value = init_velocity.y;

var planets = {
  earth: {
    init_velocity: 20,
    drag_coeff: 0.3,
    density: 1.3,
  },
  moon: {
    init_velocity: 30,
    drag_coeff: 0.3,
    density: 0,
  },
  mars: {
    init_velocity: 20,
    drag_coeff: 0.3,
    density: 0.13,
  },
  terraformedMars: {
    init_velocity: 20,
    drag_coeff: 0.3,
    density: 1.0,
  },
  venus: {
    init_velocity: 20,
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
  burn_alt =  num_values['altitude'];
  burn_duration = num_values['burn_time'];
  burn_thrust = num_values['thrust'];

  load_values(num_values);

  return false;
}

function load_values(values) {
  // Simulation conditions
  init_velocity = {x: 0, y: values['init_velocity']};
  drag_coeff = values['drag_coeff'];
  rho = values['density'];

  document.getElementById("drag_coeff").value = values['drag_coeff'];
  document.getElementById("density").value = values['density'];
  document.getElementById("init_velocity").value = values['init_velocity'];

  document.getElementById('stats').innerHTML = '';

  // Reset simulation
  initRockets();
  resetCamera(rocket2);
}
