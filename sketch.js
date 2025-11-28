
console.log("✅ sketch.js se ha cargado");

let font1;
let lastSeenTime = "—"; 
let lastSeenDate = "—"; 
let btGuardar;
let btGuardarData;
let canvas;

function preload() {
  font1 = loadFont('contra.ttf');
}

function setup() {
  canvas = createCanvas(300, 150);
  canvas.parent('sketch-holder');

  // Recuperar hora
  let saved = localStorage.getItem("lastSeenTime");
  if (saved) lastSeenTime = saved;

  // Recuperar fecha
  let savedDate = localStorage.getItem("lastSeenDate");
  if (savedDate) lastSeenDate = savedDate;

  // --- BOTÓN GUARDAR HORA ---
  btGuardar = createButton("Guardar hora");
  btGuardar.parent('sketch-holder');
  btGuardar.addClass('guardar-hora-btn');
  configurarEstiloBoton(btGuardar, "#ff5555", "#ff7777");
  btGuardar.mousePressed(guardarHoraActual);

  // --- BOTÓN GUARDAR DATA ---
  btGuardarData = createButton("Guardar Data");
  btGuardarData.parent('sketch-holder');
  btGuardarData.addClass('guardar-data-btn');
  configurarEstiloBoton(btGuardarData, "#008f39", "#006f10");
  btGuardarData.mousePressed(guardarDataActual);
}



function draw() {
  background(245);

  let h = hour();
  let m = minute();
  let s = second();

  let segonheight = map(s, 0, 59, 0, height);
  let minutheight = map(m, 0, 59, 0, height);
  let horaheight  = map(h, 0, 23, 0, height/2);

  let x1 = 20 * noise(0.05 * frameCount);
  let y1 = 20 * noise(0.05 * frameCount + 10000);
  let x2 = 20 * noise(0.05 * frameCount);
  let y2 = 20 * noise(0.05 * frameCount + 10000);

  glowRect(x1, y1, 100, segonheight, color(0, 143, 57), color(0, 143, 57, 120));
  glowRect(x2 + 200, y2, 100, minutheight, color(0), color(0, 0, 0, 120));

  glitchGlowTriangle(
    150, horaheight,
    0, 0, 300, 0,
    color(255, 0, 0),
    color(255, 0, 0, 120)
  );

  // --- TEXTOS ---
  textFont(font1);
  textAlign(CENTER, BOTTOM);
  textSize(25);
  fill(255);
  text("Hora: " + h, 150, 20);
  text("Segons: " + s, 50, 75);

  fill(255, 0, 0);
  text("Minuts: " + m, 250, 75);

  textAlign(LEFT, CENTER);
  textSize(14);
  fill(0);
  text("Hora del atac: " + lastSeenTime, 10, 125);
  text("Data del atac: " + lastSeenDate, 10, 143);

  crearInterferencias();
}

// ===============================================
//  BOTONES
// ===============================================

function configurarEstiloBoton(boton, colorBase, colorHover) {
  boton.style("background-color", colorBase);
  boton.style("color", "white");
  boton.style("border", "none");
  boton.style("padding", "3px 5px");
  boton.style("border-radius", "8px");
  boton.style("font-size", "10px");
  boton.style("cursor", "pointer");
  boton.style("font-family", "Arial");

  boton.mouseOver(() => boton.style("background-color", colorHover));
  boton.mouseOut(() => boton.style("background-color", colorBase));
}

function guardarHoraActual() {
  let h = nf(hour(), 2);
  let m = nf(minute(), 2);
  let s = nf(second(), 2);

  lastSeenTime = `${h}:${m}:${s}`;
  localStorage.setItem("lastSeenTime", lastSeenTime);
}

function guardarDataActual() {
  let d = nf(day(), 2);
  let mo = nf(month(), 2);
  let y = year();

  lastSeenDate = `${d}/${mo}/${y}`;
  localStorage.setItem("lastSeenDate", lastSeenDate);
}

// ===============================================
//  INTERFERENCIAS
// ===============================================

function crearInterferencias() {
  let numLineas = 3;

  for (let i = 0; i < numLineas; i++) {
    let n = noise(frameCount * 0.05 + i * 0.3);
    let y = n * height;
    let grosorBase = map(noise(frameCount * 0.07 + i * 1.1), 0, 1, 0.7, 3.5);

    if (random() < 0.08) grosorBase *= 4;

    let brillo = map(noise(frameCount * 0.09 + i * 2.3), 0, 1, 180, 255);

    stroke(255, brillo);
    strokeWeight(grosorBase);

    let numSegmentos = 5;
    for (let s = 0; s < numSegmentos; s++) {
      if (random() < 0.7) {
        let x1 = map(s, 0, numSegmentos, -10, width + 10);
        let x2 = map(s + 1, 0, numSegmentos, -10, width + 10);
        let interferenciaY = random(-1.5, 1.5);
        line(x1, y + interferenciaY, x2, y + interferenciaY);
      }
    }
  }

  strokeWeight(1);
}

// ===============================================
//  GLOW RECT
// ===============================================

function glowRect(x, y, w, h, baseColor, glowColor, layers = 15) {
  noStroke();
  for (let i = layers; i > 0; i--) {
    fill(red(glowColor), green(glowColor), blue(glowColor), 20);
    rect(x - i / 2, y - i / 2, w + i, h + i);
  }
  fill(baseColor);
  rect(x, y, w, h);
}

// ===============================================
//  TRIANGLE + GLITCH + GLOW
// ===============================================

function glitchGlowTriangle(x1, y1, x2, y2, x3, y3, baseColor, glowColor, layers = 18) {
  noStroke();
  let glitchChance = 0.25;
  let ga = 8;

  let gx1 = x1, gy1 = y1;
  let gx2 = x2, gy2 = y2;
  let gx3 = x3, gy3 = y3;

  if (random() < glitchChance) {
    gx1 += random(-ga, ga); gy1 += random(-ga, ga);
    gx2 += random(-ga, ga); gy2 += random(-ga, ga);
    gx3 += random(-ga, ga); gy3 += random(-ga, ga);

    fill(255, 0, 0, 130);
    triangle(gx1 + 2, gy1, gx2 + 2, gy2, gx3 + 2, gy3);

    fill(0, 255, 255, 130);
    triangle(gx1 - 2, gy1, gx2 - 2, gy2, gx3 - 2, gy3);
  }

  for (let i = layers; i > 0; i--) {
    fill(red(glowColor), green(glowColor), blue(glowColor), 30);
    beginShape();
    vertex(gx1, gy1 + i / 3);
    vertex(gx2 - i / 3, gy2 - i / 4);
    vertex(gx3 + i / 3, gy3 - i / 4);
    endShape(CLOSE);
  }

  fill(baseColor);
  triangle(gx1, gy1, gx2, gy2, gx3, gy3);
}


