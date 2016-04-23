function process_form(form) {
    var inputs = form.getElementsByTagName("input");

    // Parse user input
    var num_values = {};
    for (var i = 0; i < inputs.length; i++) {
        if(inputs[i].type != "text") {
            continue;
        }

        num_values[inputs[i].name] = inputs[i].value;
    }
    console.log(num_values);
    burn_alt =  Number(num_values['altitude']);
    burn_duration = Number(num_values['burn_time']);
    burn_thrust = Number(num_values['thrust']);

    // Reset simulation
    initRockets();
    resetCamera(rocket2);

    return false;
}
