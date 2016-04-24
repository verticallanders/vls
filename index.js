function navigation() {
  var hash = location.hash || "#intro";
  var page = hash.split("/")[0];
  if(page == "#info") {
    document.getElementById("selectpage").style.display = "none";
    document.getElementById("mainpage").style.display = "none";
    document.getElementById("intropage").style.display = "none";
    document.getElementById("infopage").style.display = "block";
  } else if(page == "#select") {
    document.getElementById("mainpage").style.display = "none";
    document.getElementById("intropage").style.display = "none";
    document.getElementById("infopage").style.display = "none";
    document.getElementById("selectpage").style.display = "block";
  } else if(page == "#main") {
    document.getElementById("selectpage").style.display = "none";
    document.getElementById("intropage").style.display = "none";
    document.getElementById("infopage").style.display = "none";
    document.getElementById("mainpage").style.display = "block";
    init();
    Engine.run(engine);
  } else {
    document.getElementById("selectpage").style.display = "none";
    document.getElementById("mainpage").style.display = "none";
    document.getElementById("infopage").style.display = "none";
    document.getElementById("intropage").style.display = "block";
  }
}
navigation();

function picker(element, list, target) {
  for(name in list) {
    var choice = document.createElement("a");
    choice.href = "#";
    choice.name = name;
    choice.data = list[name];
    choice.target = target;
    choice.onclick = function(e) {
      Scenario[target] = this.data;
      populateForm(Scenario[target]);
      init();
      return false;
    };
    var img = document.createElement("img");
    img.src = list[name].thumbnail;
    img.height = 64;
    choice.appendChild(img);
    namespan = document.createElement("span");
    namespan.innerHTML = "<br>"+name;
    choice.appendChild(namespan);
    choice.style.float = "left";
    choice.style.display = "inline-block";
    element.appendChild(choice);
  }
}

function populateForm(scenario) {
  document.getElementById('init_altitude').value = scenario.start_alt || document.getElementById('init_altitude').value;
  document.getElementById('init_velocity').value = scenario.start_vel || document.getElementById('init_velocity').value;
  document.getElementById('density').value = scenario.rho || document.getElementById('density').value;
  document.getElementById('gravity').value = scenario.g || document.getElementById('gravity').value;
  document.getElementById('mass').value = scenario.mass || document.getElementById('mass').value;
  document.getElementById('drag_coeff').value = scenario.Cd || document.getElementById('drag_coeff').value;
}

picker(document.getElementById("site-picker"), sites, "Site");
picker(document.getElementById("rocket-picker"), rockets, "Rocket");

document.getElementById("select-earth").onclick = function(e) {
  Scenario.Site = sites.Earth;
};
document.getElementById("select-moon").onclick = function(e) {
  Scenario.Site = sites.Moon;
};
document.getElementById("select-mars").onclick = function(e) {
  Scenario.Site = sites.Mars;
};

document.getElementById("select-venus").onclick = function(e) {
  Scenario.Site = sites.Venus;
};

document.getElementById("select-t-mars").onclick = function(e) {
  Scenario.Site = sites["Terraformed Mars"];
};

document.getElementById("select-t-rosetta").onclick = function(e) {
  Scenario.Site = sites["67P/Churyumov–Gerasimenko"];
};

var helpers = document.getElementsByClassName("help");
for(var i=0; i<helpers.length; i++) {
  helpers[i].onclick = function(e) {
    this.style.display = "none";
  };
}

document.getElementById("select-earth-help").onclick = function(e) {
  document.getElementById("help-earth").style.display = "block";
};

document.getElementById("select-moon-help").onclick = function(e) {
  document.getElementById("help-moon").style.display = "block";
};

document.getElementById("select-mars-help").onclick = function(e) {
  document.getElementById("help-mars").style.display = "block";
};

document.getElementById("select-venus-help").onclick = function(e) {
  document.getElementById("help-venus").style.display = "block";
};

document.getElementById("select-tmars-help").onclick = function(e) {
  document.getElementById("help-tmars").style.display = "block";
};

document.getElementById("select-earth-help").onclick = function(e) {
  document.getElementById("help-earth").style.display = "block";
};

document.getElementById("select-rosetta-help").onclick = function(e) {
  document.getElementById("help-rosetta").style.display = "block";
};

document.getElementById("label-initv").onclick = function(e) {
  document.getElementById("help-initv").style.display = "block";
};

document.getElementById("label-atmo").onclick = function(e) {
  document.getElementById("help-atmo").style.display = "block";
};

document.getElementById("label-drag").onclick = function(e) {
  document.getElementById("help-drag").style.display = "block";
};

window.onhashchange = navigation;
