document.getElementById("altitude").value = burn_alt;
document.getElementById("burn_time").value = burn_duration;
document.getElementById("thrust").value = burn_thrust;

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

    // Simulation conditions
    init_velocity = {x: 0, y: num_values['init_velocity']};
    drag_coeff = num_values['drag_coeff'];
    rho = num_values['density'];

    // Rocket controls
    burn_alt =  num_values['altitude'];
    burn_duration = num_values['burn_time'];
    burn_thrust = num_values['thrust'];

    document.getElementById("stats").innerHTML = "";

    // Reset simulation
    initRockets();
    resetCamera(rocket2);

    return false;
}
