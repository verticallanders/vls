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

window.onhashchange = navigation;
