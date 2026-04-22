let paletteCards = [];

let generatedFeelingTags = [];
let generatedSceneTags = [];
let selectedFeelingTags = [];
let selectedSceneTags = [];

let draggingColor = null;
let draggingTag = null;
let offsetX = 0;
let offsetY = 0;

let resultData = null;

const MAX_GENERATED_FEELING = 12;
const MAX_GENERATED_SCENE = 12;
const MAX_SELECTED_FEELING = 10;
const MAX_SELECTED_SCENE = 8;

const EMOTIONS = ["Calm", "Joy", "Nostalgia", "Loneliness", "Anxiety", "Anger"];

// ---------- Layout ----------
const palettePanel = { x: 24, y: 96, w: 230, h: 760 };
const generatedPanel = { x: 286, y: 96, w: 560, h: 760 };
const selectionPanel = { x: 866, y: 96, w: 280, h: 760 };
const resultPanel = { x: 1166, y: 96, w: 250, h: 760 };

// Generated sub boxes
const genFeelingBox = { x: 308, y: 280, w: 516, h: 170 };
const genSceneBox = { x: 308, y: 560, w: 516, h: 210 };

// Selection sub boxes
const selFeelingBox = { x: 888, y: 280, w: 236, h: 170 };
const selSceneBox = { x: 888, y: 560, w: 236, h: 210 };

// Scroll states
let genFeelingScroll = 0;
let genSceneScroll = 0;
let selFeelingScroll = 0;
let selSceneScroll = 0;

// ---------- Palette Data ----------
const PALETTE_DATA = [
  {
    hex: "#D96C6C",
    feeling: ["vivid", "electric"],
    scene: ["neon dusk", "red traffic light"],
  },
  {
    hex: "#EE8B72",
    feeling: ["warm", "buoyant"],
    scene: ["warm pavement", "late summer air"],
  },
  {
    hex: "#F4B75D",
    feeling: ["bright", "open"],
    scene: ["golden hour", "sunlit sidewalk"],
  },
  {
    hex: "#F4D35E",
    feeling: ["glowing", "lively"],
    scene: ["soft morning air", "summer corner"],
  },
  {
    hex: "#C4CB73",
    feeling: ["fresh", "mossy"],
    scene: ["green silence", "after rain"],
  },
  {
    hex: "#97B3AE",
    feeling: ["grounded", "gentle"],
    scene: ["garden shade", "open window"],
  },
  {
    hex: "#C9D8C9",
    feeling: ["light", "quiet"],
    scene: ["linen curtains", "morning kitchen"],
  },
  {
    hex: "#6F8C86",
    feeling: ["reflective", "tidal"],
    scene: ["evening echo", "distant shoreline"],
  },
  {
    hex: "#7EC7CF",
    feeling: ["clear", "buoyant"],
    scene: ["sea breeze", "bright pool light"],
  },
  {
    hex: "#81B9D8",
    feeling: ["airy", "distant"],
    scene: ["pale horizon", "blue afternoon"],
  },
  {
    hex: "#6E88C8",
    feeling: ["inward", "still"],
    scene: ["twilight room", "far coastline"],
  },
  {
    hex: "#B8A3D1",
    feeling: ["tender", "hushed"],
    scene: ["powdered curtains", "violet dusk"],
  },
  {
    hex: "#8E6FAF",
    feeling: ["mysterious", "nocturnal"],
    scene: ["midnight hallway", "velvet night"],
  },
  {
    hex: "#E8B7C8",
    feeling: ["soft", "romantic"],
    scene: ["blush evening", "soft lamp glow"],
  },
  {
    hex: "#D6CBBF",
    feeling: ["muted", "restrained"],
    scene: ["fading wallpaper", "unfinished dusk"],
  },
  {
    hex: "#F0EEEA",
    feeling: ["pale", "hollow"],
    scene: ["empty hallway", "pale window light"],
  },
];

// ---------- Weights ----------
const feelingWeights = {
  vivid: {
    Joy: 1.8,
    Anger: 1.4,
    Anxiety: 0.7,
    Calm: 0.0,
    Nostalgia: 0.1,
    Loneliness: 0.0,
  },
  electric: {
    Anxiety: 1.5,
    Anger: 1.8,
    Joy: 1.0,
    Calm: 0.0,
    Nostalgia: 0.0,
    Loneliness: 0.0,
  },
  warm: {
    Joy: 1.7,
    Calm: 0.8,
    Nostalgia: 0.7,
    Loneliness: 0.1,
    Anxiety: 0.1,
    Anger: 0.2,
  },
  buoyant: {
    Joy: 2.4,
    Calm: 0.3,
    Anxiety: 0.4,
    Nostalgia: 0.2,
    Loneliness: 0.0,
    Anger: 0.1,
  },
  bright: {
    Joy: 2.7,
    Calm: 0.2,
    Anxiety: 0.2,
    Nostalgia: 0.2,
    Loneliness: 0.0,
    Anger: 0.1,
  },
  open: {
    Joy: 1.5,
    Calm: 1.0,
    Nostalgia: 0.2,
    Loneliness: 0.0,
    Anxiety: 0.1,
    Anger: 0.0,
  },
  glowing: {
    Joy: 2.1,
    Calm: 0.7,
    Nostalgia: 0.5,
    Loneliness: 0.0,
    Anxiety: 0.2,
    Anger: 0.0,
  },
  lively: {
    Joy: 2.2,
    Calm: 0.2,
    Anxiety: 0.5,
    Nostalgia: 0.1,
    Loneliness: 0.0,
    Anger: 0.2,
  },

  fresh: {
    Calm: 1.2,
    Joy: 1.0,
    Nostalgia: 0.3,
    Loneliness: 0.0,
    Anxiety: 0.1,
    Anger: 0.0,
  },
  mossy: {
    Calm: 1.6,
    Nostalgia: 0.7,
    Loneliness: 0.4,
    Joy: 0.0,
    Anxiety: 0.1,
    Anger: 0.0,
  },
  grounded: {
    Calm: 2.5,
    Nostalgia: 0.6,
    Loneliness: 0.2,
    Joy: 0.2,
    Anxiety: 0.2,
    Anger: 0.0,
  },
  gentle: {
    Calm: 1.6,
    Nostalgia: 0.8,
    Joy: 0.4,
    Loneliness: 0.2,
    Anxiety: 0.1,
    Anger: 0.0,
  },
  light: {
    Calm: 1.0,
    Joy: 1.2,
    Nostalgia: 0.4,
    Loneliness: 0.1,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  quiet: {
    Calm: 1.7,
    Nostalgia: 0.9,
    Loneliness: 1.2,
    Joy: 0.0,
    Anxiety: 0.3,
    Anger: 0.0,
  },

  reflective: {
    Nostalgia: 2.2,
    Calm: 0.8,
    Loneliness: 0.9,
    Joy: 0.1,
    Anxiety: 0.2,
    Anger: 0.0,
  },
  tidal: {
    Calm: 0.9,
    Nostalgia: 0.8,
    Loneliness: 0.8,
    Joy: 0.2,
    Anxiety: 0.2,
    Anger: 0.0,
  },
  clear: {
    Calm: 1.3,
    Joy: 0.8,
    Anxiety: 0.0,
    Nostalgia: 0.2,
    Loneliness: 0.0,
    Anger: 0.0,
  },
  airy: {
    Calm: 1.2,
    Joy: 0.5,
    Nostalgia: 0.4,
    Loneliness: 0.2,
    Anxiety: 0.1,
    Anger: 0.0,
  },
  distant: {
    Loneliness: 2.5,
    Nostalgia: 1.1,
    Calm: 0.4,
    Joy: 0.0,
    Anxiety: 0.4,
    Anger: 0.0,
  },
  inward: {
    Loneliness: 1.5,
    Nostalgia: 1.4,
    Calm: 0.6,
    Joy: 0.0,
    Anxiety: 0.4,
    Anger: 0.0,
  },
  still: {
    Calm: 1.6,
    Loneliness: 1.0,
    Nostalgia: 0.8,
    Joy: 0.0,
    Anxiety: 0.2,
    Anger: 0.0,
  },

  tender: {
    Nostalgia: 1.8,
    Calm: 1.0,
    Joy: 0.4,
    Loneliness: 0.4,
    Anxiety: 0.1,
    Anger: 0.0,
  },
  hushed: {
    Calm: 1.2,
    Loneliness: 1.3,
    Nostalgia: 0.8,
    Joy: 0.0,
    Anxiety: 0.3,
    Anger: 0.0,
  },
  mysterious: {
    Nostalgia: 0.9,
    Loneliness: 1.0,
    Anxiety: 1.1,
    Calm: 0.2,
    Joy: 0.0,
    Anger: 0.2,
  },
  nocturnal: {
    Loneliness: 1.4,
    Anxiety: 1.0,
    Nostalgia: 0.8,
    Calm: 0.2,
    Joy: 0.0,
    Anger: 0.2,
  },

  soft: {
    Calm: 1.4,
    Nostalgia: 1.2,
    Joy: 0.3,
    Loneliness: 0.3,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  romantic: {
    Nostalgia: 1.7,
    Joy: 1.0,
    Calm: 0.4,
    Loneliness: 0.1,
    Anxiety: 0.1,
    Anger: 0.0,
  },

  muted: {
    Nostalgia: 1.0,
    Loneliness: 1.0,
    Calm: 0.8,
    Joy: 0.0,
    Anxiety: 0.6,
    Anger: 0.0,
  },
  restrained: {
    Anxiety: 0.9,
    Calm: 0.9,
    Nostalgia: 0.7,
    Loneliness: 0.6,
    Joy: 0.0,
    Anger: 0.0,
  },

  pale: {
    Nostalgia: 1.4,
    Loneliness: 1.0,
    Calm: 0.5,
    Joy: 0.0,
    Anxiety: 0.3,
    Anger: 0.0,
  },
  hollow: {
    Loneliness: 2.0,
    Nostalgia: 1.0,
    Anxiety: 0.6,
    Calm: 0.1,
    Joy: 0.0,
    Anger: 0.0,
  },
};

const sceneWeights = {
  "neon dusk": {
    Joy: 0.8,
    Anxiety: 0.9,
    Anger: 0.7,
    Nostalgia: 0.2,
    Calm: 0.0,
    Loneliness: 0.1,
  },
  "red traffic light": {
    Anxiety: 1.3,
    Anger: 1.5,
    Joy: 0.0,
    Calm: 0.0,
    Nostalgia: 0.0,
    Loneliness: 0.0,
  },
  "warm pavement": {
    Joy: 1.0,
    Nostalgia: 0.8,
    Calm: 0.3,
    Anxiety: 0.1,
    Loneliness: 0.0,
    Anger: 0.3,
  },
  "late summer air": {
    Nostalgia: 1.2,
    Joy: 1.0,
    Calm: 0.4,
    Anxiety: 0.0,
    Loneliness: 0.1,
    Anger: 0.0,
  },
  "golden hour": {
    Joy: 1.2,
    Nostalgia: 1.0,
    Calm: 0.5,
    Anxiety: 0.0,
    Loneliness: 0.0,
    Anger: 0.0,
  },
  "sunlit sidewalk": {
    Joy: 1.3,
    Calm: 0.4,
    Nostalgia: 0.5,
    Anxiety: 0.0,
    Loneliness: 0.0,
    Anger: 0.0,
  },
  "soft morning air": {
    Calm: 1.3,
    Joy: 0.8,
    Nostalgia: 0.6,
    Anxiety: 0.0,
    Loneliness: 0.1,
    Anger: 0.0,
  },
  "summer corner": {
    Nostalgia: 1.5,
    Joy: 1.0,
    Calm: 0.3,
    Anxiety: 0.0,
    Loneliness: 0.1,
    Anger: 0.0,
  },

  "green silence": {
    Calm: 1.5,
    Nostalgia: 0.7,
    Loneliness: 0.3,
    Joy: 0.0,
    Anxiety: 0.1,
    Anger: 0.0,
  },
  "after rain": {
    Calm: 1.3,
    Nostalgia: 1.0,
    Loneliness: 0.2,
    Joy: 0.1,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  "garden shade": {
    Calm: 1.4,
    Nostalgia: 0.7,
    Loneliness: 0.1,
    Joy: 0.2,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  "open window": {
    Calm: 1.1,
    Joy: 0.7,
    Nostalgia: 0.5,
    Anxiety: 0.0,
    Loneliness: 0.1,
    Anger: 0.0,
  },
  "linen curtains": {
    Nostalgia: 1.3,
    Calm: 0.8,
    Loneliness: 0.3,
    Joy: 0.0,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  "morning kitchen": {
    Nostalgia: 1.1,
    Calm: 0.9,
    Joy: 0.3,
    Anxiety: 0.0,
    Loneliness: 0.1,
    Anger: 0.0,
  },

  "evening echo": {
    Nostalgia: 1.6,
    Loneliness: 0.9,
    Calm: 0.3,
    Joy: 0.0,
    Anxiety: 0.2,
    Anger: 0.0,
  },
  "distant shoreline": {
    Loneliness: 1.3,
    Nostalgia: 1.0,
    Calm: 0.7,
    Joy: 0.0,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  "sea breeze": {
    Calm: 1.3,
    Joy: 0.7,
    Nostalgia: 0.4,
    Anxiety: 0.0,
    Loneliness: 0.1,
    Anger: 0.0,
  },
  "bright pool light": {
    Joy: 1.2,
    Calm: 0.5,
    Nostalgia: 0.2,
    Anxiety: 0.0,
    Loneliness: 0.0,
    Anger: 0.0,
  },

  "pale horizon": {
    Calm: 0.9,
    Loneliness: 0.8,
    Nostalgia: 0.8,
    Joy: 0.1,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  "blue afternoon": {
    Nostalgia: 1.0,
    Calm: 0.7,
    Loneliness: 0.6,
    Joy: 0.1,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  "twilight room": {
    Loneliness: 1.2,
    Nostalgia: 1.0,
    Calm: 0.4,
    Joy: 0.0,
    Anxiety: 0.2,
    Anger: 0.0,
  },
  "far coastline": {
    Loneliness: 1.0,
    Calm: 0.8,
    Nostalgia: 0.9,
    Joy: 0.0,
    Anxiety: 0.1,
    Anger: 0.0,
  },

  "powdered curtains": {
    Nostalgia: 1.7,
    Calm: 0.5,
    Loneliness: 0.5,
    Joy: 0.0,
    Anxiety: 0.0,
    Anger: 0.0,
  },
  "violet dusk": {
    Nostalgia: 1.0,
    Loneliness: 0.8,
    Anxiety: 0.4,
    Calm: 0.2,
    Joy: 0.0,
    Anger: 0.0,
  },
  "midnight hallway": {
    Loneliness: 1.5,
    Anxiety: 0.8,
    Nostalgia: 0.6,
    Calm: 0.1,
    Joy: 0.0,
    Anger: 0.2,
  },
  "velvet night": {
    Loneliness: 1.0,
    Nostalgia: 0.9,
    Anxiety: 0.7,
    Calm: 0.2,
    Joy: 0.0,
    Anger: 0.1,
  },

  "blush evening": {
    Nostalgia: 1.3,
    Joy: 0.7,
    Calm: 0.4,
    Anxiety: 0.0,
    Loneliness: 0.1,
    Anger: 0.0,
  },
  "soft lamp glow": {
    Calm: 1.0,
    Nostalgia: 1.2,
    Joy: 0.4,
    Anxiety: 0.0,
    Loneliness: 0.2,
    Anger: 0.0,
  },

  "fading wallpaper": {
    Nostalgia: 1.8,
    Loneliness: 0.8,
    Calm: 0.2,
    Joy: 0.0,
    Anxiety: 0.1,
    Anger: 0.0,
  },
  "unfinished dusk": {
    Nostalgia: 1.2,
    Loneliness: 1.0,
    Anxiety: 0.4,
    Calm: 0.2,
    Joy: 0.0,
    Anger: 0.0,
  },
  "empty hallway": {
    Loneliness: 1.7,
    Nostalgia: 0.8,
    Anxiety: 0.4,
    Calm: 0.1,
    Joy: 0.0,
    Anger: 0.0,
  },
  "pale window light": {
    Nostalgia: 1.4,
    Calm: 0.8,
    Loneliness: 0.5,
    Joy: 0.0,
    Anxiety: 0.0,
    Anger: 0.0,
  },
};

const PROFILE_NAMES = {
  "Calm|Nostalgia": "The Soft Archive",
  "Calm|Joy": "The Quiet Bloom",
  "Calm|Loneliness": "The Still Window",
  "Joy|Calm": "The Sunlit Spark",
  "Joy|Nostalgia": "The Golden Echo",
  "Joy|Anger": "The Bright Riot",
  "Nostalgia|Calm": "The Faded Letter",
  "Nostalgia|Loneliness": "The Distant Keepsake",
  "Nostalgia|Joy": "The Summer Relic",
  "Loneliness|Nostalgia": "The Distant Keepsake",
  "Loneliness|Calm": "The Empty Window",
  "Loneliness|Anxiety": "The Thin Air",
  "Anxiety|Anger": "The Restless Flame",
  "Anxiety|Loneliness": "The Quiet Alarm",
  "Anger|Joy": "The Live Wire",
  "Anger|Anxiety": "The Sharp Pulse",
};

function setup() {
  createCanvas(1440, 900);
  initPalette();
}

function draw() {
  background("#F0EEEA");

  drawMainTitle();
  drawPanels();
  drawPaletteCards();
  drawGeneratedTags();
  drawSelectedTags();
  drawReading();
  drawResetButton();

  if (draggingColor) draggingColor.display();
  if (draggingTag) draggingTag.displayDragged();
}

function drawMainTitle() {
  noStroke();
  fill(35);
  textAlign(CENTER, CENTER);
  textFont("Times New Roman");
  textStyle(BOLD);
  textSize(29);
  text("Emotional Reconstruction", width / 2, 30);

  textFont("Arial");
  textStyle(NORMAL);
  fill(105);
  textSize(13);
  text("From color to language to feeling", width / 2, 60);
}

function drawPanels() {
  noStroke();
  fill(250, 248, 245);
  rect(palettePanel.x, palettePanel.y, palettePanel.w, palettePanel.h, 24);
  rect(
    generatedPanel.x,
    generatedPanel.y,
    generatedPanel.w,
    generatedPanel.h,
    24
  );
  rect(
    selectionPanel.x,
    selectionPanel.y,
    selectionPanel.w,
    selectionPanel.h,
    24
  );
  rect(resultPanel.x, resultPanel.y, resultPanel.w, resultPanel.h, 24);

  fill(45);
  textAlign(LEFT, CENTER);
  textFont("Times New Roman");
  textStyle(BOLD);
  textSize(22);
  text("1. Color Palette", palettePanel.x + 20, palettePanel.y + 32);
  text("2. Generated Tags", generatedPanel.x + 22, generatedPanel.y + 32);
  text("3. Selection Board", selectionPanel.x + 22, selectionPanel.y + 32);
  text("4. Reading", resultPanel.x + 22, resultPanel.y + 32);

  textFont("Arial");
  textStyle(NORMAL);
  fill(110);
  textSize(10.5);

  text(
    "Drag a swatch into the Generated Tags areas.",
    palettePanel.x + 20,
    palettePanel.y + 62,
    palettePanel.w - 40,
    34
  );

  text(
    "Drop into Feeling Words or Scene Fragments to generate tags.",
    generatedPanel.x + 22,
    generatedPanel.y + 62,
    generatedPanel.w - 44,
    30
  );

  text(
    "Click a tag to remove it.",
    selectionPanel.x + 22,
    selectionPanel.y + 62,
    selectionPanel.w - 44,
    20
  );
}

function drawPaletteCards() {
  for (let card of paletteCards) card.display();
}

function drawGeneratedTags() {
  fill(70);
  textAlign(LEFT, CENTER);
  textFont("Times New Roman");
  textStyle(BOLD);
  textSize(16);

  text("Feeling Words", generatedPanel.x + 22, generatedPanel.y + 166);
  text("Scene Fragments", generatedPanel.x + 22, generatedPanel.y + 446);

  fill(145);
  textFont("Arial");
  textStyle(NORMAL);
  textSize(10);
  text(
    `${generatedFeelingTags.length}/${MAX_GENERATED_FEELING}`,
    generatedPanel.x + generatedPanel.w - 52,
    generatedPanel.y + 166
  );
  text(
    `${generatedSceneTags.length}/${MAX_GENERATED_SCENE}`,
    generatedPanel.x + generatedPanel.w - 52,
    generatedPanel.y + 446
  );

  stroke("#DDD5CC");
  noFill();
  rect(genFeelingBox.x, genFeelingBox.y, genFeelingBox.w, genFeelingBox.h, 16);
  rect(genSceneBox.x, genSceneBox.y, genSceneBox.w, genSceneBox.h, 16);

  layoutGeneratedFeeling();
  layoutGeneratedScene();

  drawTagArea(generatedFeelingTags, genFeelingBox, "generated");
  drawTagArea(generatedSceneTags, genSceneBox, "generated");

  drawScrollHint(
    genFeelingBox,
    getGeneratedFeelingContentHeight(),
    genFeelingBox.h,
    genFeelingScroll
  );
  drawScrollHint(
    genSceneBox,
    getGeneratedSceneContentHeight(),
    genSceneBox.h,
    genSceneScroll
  );
}

function drawSelectedTags() {
  fill(70);
  textAlign(LEFT, CENTER);
  textFont("Times New Roman");
  textStyle(BOLD);
  textSize(16);

  text("Selected Feelings", selectionPanel.x + 22, selectionPanel.y + 166);
  text("Selected Scenes", selectionPanel.x + 22, selectionPanel.y + 446);

  stroke("#DDD5CC");
  noFill();
  rect(selFeelingBox.x, selFeelingBox.y, selFeelingBox.w, selFeelingBox.h, 16);
  rect(selSceneBox.x, selSceneBox.y, selSceneBox.w, selSceneBox.h, 16);

  layoutSelectedFeeling();
  layoutSelectedScene();

  drawTagArea(selectedFeelingTags, selFeelingBox, "selected");
  drawTagArea(selectedSceneTags, selSceneBox, "selected");

  drawScrollHint(
    selFeelingBox,
    getSelectedFeelingContentHeight(),
    selFeelingBox.h,
    selFeelingScroll
  );
  drawScrollHint(
    selSceneBox,
    getSelectedSceneContentHeight(),
    selSceneBox.h,
    selSceneScroll
  );
}

function drawTagArea(tagArray, area, mode) {
  for (let tag of tagArray) {
    if (mode === "generated") {
      if (tag !== draggingTag && isTagVisible(tag, area, false)) {
        tag.display();
      }
    } else {
      if (isTagVisible(tag, area, true)) {
        tag.displaySelected();
      }
    }
  }
}

function drawScrollHint(area, contentH, viewH, scrollY) {
  if (contentH <= viewH) return;

  let barW = 4;
  let trackX = area.x + area.w - 8;
  let trackY = area.y + 8;
  let trackH = area.h - 16;

  noStroke();
  fill(235, 231, 225);
  rect(trackX, trackY, barW, trackH, 4);

  let thumbH = max(22, (viewH / contentH) * trackH);
  let maxThumbY = trackH - thumbH;
  let maxScroll = max(1, contentH - viewH);
  let thumbY = trackY + map(scrollY, 0, maxScroll, 0, maxThumbY);

  fill("#C7BCAE");
  rect(trackX, thumbY, barW, thumbH, 4);
}

function isTagVisible(tag, area, selectedMode) {
  let x = selectedMode ? tag.sx : tag.x;
  let y = selectedMode ? tag.sy : tag.y;
  let w = selectedMode ? tag.sw : tag.w;
  let h = selectedMode ? tag.sh : tag.h;

  return (
    x + w > area.x &&
    x < area.x + area.w &&
    y + h > area.y &&
    y < area.y + area.h
  );
}

function drawReading() {
  if (!resultData) {
    fill(95);
    textAlign(LEFT, TOP);
    textFont("Arial");
    textStyle(NORMAL);
    textSize(13);
    text(
      "Build a profile by:\n\n1. dragging color swatches into the Feeling Words or Scene Fragments boxes\n2. dragging generated tags into the Selection Board\n\nThe final reading combines emotional words with poetic scenes.",
      resultPanel.x + 22,
      resultPanel.y + 82,
      resultPanel.w - 40,
      240
    );
    return;
  }

  let x = resultPanel.x + 22;
  let y = resultPanel.y + 80;

  fill(35);
  textAlign(LEFT, TOP);
  textFont("Times New Roman");
  textStyle(BOLD);
  textSize(16);
  text("Archetype", x, y);

  textSize(27);
  text(resultData.profileName, x, y + 26, resultPanel.w - 40, 100);

  fill(90);
  textFont("Arial");
  textStyle(NORMAL);
  textSize(12);
  text(resultData.subtitle, x, y + 104, resultPanel.w - 40, 40);

  fill(40);
  textFont("Times New Roman");
  textStyle(BOLD);
  textSize(16);
  text("Interpretation", x, y + 168);

  fill(95);
  textFont("Arial");
  textStyle(NORMAL);
  textSize(12);
  text(resultData.description, x, y + 198, resultPanel.w - 40, 128);

  fill(40);
  textFont("Times New Roman");
  textStyle(BOLD);
  textSize(16);
  text("Selected Language", x, y + 342);

  fill(95);
  textFont("Arial");
  textStyle(NORMAL);
  textSize(11.5);
  text(resultData.languageLine, x, y + 372, resultPanel.w - 40, 70);

  fill(40);
  textFont("Times New Roman");
  textStyle(BOLD);
  textSize(16);
  text("Score Breakdown", x, y + 450);

  let barX = x;
  let barY = y + 485;
  let barW = 150;
  let barH = 9;
  let gapY = 36;

  textFont("Arial");
  textStyle(NORMAL);
  for (let i = 0; i < resultData.sorted.length; i++) {
    let item = resultData.sorted[i];

    fill(70);
    noStroke();
    textSize(11);
    text(`${item.name}: ${item.percent}%`, barX, barY + i * gapY);

    fill(232, 228, 222);
    rect(barX, barY + 14 + i * gapY, barW, barH, 8);

    fill(getEmotionColor(item.name));
    rect(
      barX,
      barY + 14 + i * gapY,
      map(item.percent, 0, 100, 0, barW),
      barH,
      8
    );
  }
}

function mousePressed() {
  if (
    mouseX > width - 118 &&
    mouseX < width - 26 &&
    mouseY > 12 &&
    mouseY < 46
  ) {
    resetAll();
    return;
  }

  for (let i = selectedFeelingTags.length - 1; i >= 0; i--) {
    if (selectedFeelingTags[i].containsSelected(mouseX, mouseY)) {
      let removed = selectedFeelingTags.splice(i, 1)[0];
      addBackGeneratedFeeling(removed);
      computeReading();
      return;
    }
  }

  for (let i = selectedSceneTags.length - 1; i >= 0; i--) {
    if (selectedSceneTags[i].containsSelected(mouseX, mouseY)) {
      let removed = selectedSceneTags.splice(i, 1)[0];
      addBackGeneratedScene(removed);
      computeReading();
      return;
    }
  }

  for (let i = generatedFeelingTags.length - 1; i >= 0; i--) {
    if (generatedFeelingTags[i].contains(mouseX, mouseY)) {
      draggingTag = generatedFeelingTags[i];
      offsetX = mouseX - draggingTag.x;
      offsetY = mouseY - draggingTag.y;
      return;
    }
  }

  for (let i = generatedSceneTags.length - 1; i >= 0; i--) {
    if (generatedSceneTags[i].contains(mouseX, mouseY)) {
      draggingTag = generatedSceneTags[i];
      offsetX = mouseX - draggingTag.x;
      offsetY = mouseY - draggingTag.y;
      return;
    }
  }

  for (let i = paletteCards.length - 1; i >= 0; i--) {
    if (paletteCards[i].contains(mouseX, mouseY)) {
      draggingColor = paletteCards[i].makeDragCopy();
      offsetX = mouseX - draggingColor.x;
      offsetY = mouseY - draggingColor.y;
      return;
    }
  }
}

function mouseDragged() {
  if (draggingColor) {
    draggingColor.x = mouseX - offsetX;
    draggingColor.y = mouseY - offsetY;
  }

  if (draggingTag) {
    draggingTag.x = mouseX - offsetX;
    draggingTag.y = mouseY - offsetY;
  }
}

function mouseReleased() {
  if (draggingColor) {
    if (insideRect(mouseX, mouseY, genFeelingBox)) {
      generateFeelingFromColor(draggingColor.data);
    } else if (insideRect(mouseX, mouseY, genSceneBox)) {
      generateSceneFromColor(draggingColor.data);
    }
    draggingColor = null;
  }

  if (draggingTag) {
    if (
      draggingTag.type === "feeling" &&
      insideRect(mouseX, mouseY, selFeelingBox)
    ) {
      moveToSelectedFeeling(draggingTag);
    } else if (
      draggingTag.type === "scene" &&
      insideRect(mouseX, mouseY, selSceneBox)
    ) {
      moveToSelectedScene(draggingTag);
    }
    draggingTag = null;
  }
}

function mouseWheel(event) {
  if (insideRect(mouseX, mouseY, genFeelingBox)) {
    let maxScroll = max(
      0,
      getGeneratedFeelingContentHeight() - genFeelingBox.h
    );
    genFeelingScroll = constrain(genFeelingScroll + event.delta, 0, maxScroll);
    return false;
  }

  if (insideRect(mouseX, mouseY, genSceneBox)) {
    let maxScroll = max(0, getGeneratedSceneContentHeight() - genSceneBox.h);
    genSceneScroll = constrain(genSceneScroll + event.delta, 0, maxScroll);
    return false;
  }

  if (insideRect(mouseX, mouseY, selFeelingBox)) {
    let maxScroll = max(0, getSelectedFeelingContentHeight() - selFeelingBox.h);
    selFeelingScroll = constrain(selFeelingScroll + event.delta, 0, maxScroll);
    return false;
  }

  if (insideRect(mouseX, mouseY, selSceneBox)) {
    let maxScroll = max(0, getSelectedSceneContentHeight() - selSceneBox.h);
    selSceneScroll = constrain(selSceneScroll + event.delta, 0, maxScroll);
    return false;
  }

  return true;
}

function insideRect(px, py, r) {
  return px > r.x && px < r.x + r.w && py > r.y && py < r.y + r.h;
}

function initPalette() {
  paletteCards = [];
  let startX = palettePanel.x + 20;
  let startY = palettePanel.y + 96;

  let cardW = 42;
  let cardH = 42;
  let gapX = 10;
  let gapY = 12;
  let cols = 4;

  for (let i = 0; i < PALETTE_DATA.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = startX + col * (cardW + gapX);
    let y = startY + row * (cardH + gapY);
    paletteCards.push(new PaletteCard(x, y, cardW, cardH, PALETTE_DATA[i]));
  }
}

function generateFeelingFromColor(data) {
  for (let word of data.feeling) {
    let existsG = generatedFeelingTags.some((t) => t.word === word);
    let existsS = selectedFeelingTags.some((t) => t.word === word);
    if (!existsG && !existsS) {
      generatedFeelingTags.push(new TagChip(word, data.hex, "feeling"));
    }
  }

  while (generatedFeelingTags.length > MAX_GENERATED_FEELING) {
    generatedFeelingTags.shift();
  }
}

function generateSceneFromColor(data) {
  for (let phrase of data.scene) {
    let existsG = generatedSceneTags.some((t) => t.word === phrase);
    let existsS = selectedSceneTags.some((t) => t.word === phrase);
    if (!existsG && !existsS) {
      generatedSceneTags.push(new TagChip(phrase, data.hex, "scene"));
    }
  }

  while (generatedSceneTags.length > MAX_GENERATED_SCENE) {
    generatedSceneTags.shift();
  }
}

function moveToSelectedFeeling(tag) {
  if (selectedFeelingTags.length >= MAX_SELECTED_FEELING) return;
  if (selectedFeelingTags.some((t) => t.word === tag.word)) return;

  let idx = generatedFeelingTags.indexOf(tag);
  if (idx !== -1) {
    let moved = generatedFeelingTags.splice(idx, 1)[0];
    selectedFeelingTags.push(new SelectedTag(moved.word, moved.hex, "feeling"));
    computeReading();
  }
}

function moveToSelectedScene(tag) {
  if (selectedSceneTags.length >= MAX_SELECTED_SCENE) return;
  if (selectedSceneTags.some((t) => t.word === tag.word)) return;

  let idx = generatedSceneTags.indexOf(tag);
  if (idx !== -1) {
    let moved = generatedSceneTags.splice(idx, 1)[0];
    selectedSceneTags.push(new SelectedTag(moved.word, moved.hex, "scene"));
    computeReading();
  }
}

function addBackGeneratedFeeling(tag) {
  if (!generatedFeelingTags.some((t) => t.word === tag.word)) {
    generatedFeelingTags.push(new TagChip(tag.word, tag.hex, "feeling"));
  }
  while (generatedFeelingTags.length > MAX_GENERATED_FEELING) {
    generatedFeelingTags.shift();
  }
}

function addBackGeneratedScene(tag) {
  if (!generatedSceneTags.some((t) => t.word === tag.word)) {
    generatedSceneTags.push(new TagChip(tag.word, tag.hex, "scene"));
  }
  while (generatedSceneTags.length > MAX_GENERATED_SCENE) {
    generatedSceneTags.shift();
  }
}

function layoutGeneratedFeeling() {
  let chipW = 154;
  let chipH = 34;
  let gapX = 10;
  let gapY = 10;
  let cols = 3;
  let startX = genFeelingBox.x + 10;
  let startY = genFeelingBox.y + 10 - genFeelingScroll;

  for (let i = 0; i < generatedFeelingTags.length; i++) {
    if (generatedFeelingTags[i] === draggingTag) continue;

    let col = i % cols;
    let row = floor(i / cols);

    generatedFeelingTags[i].x = startX + col * (chipW + gapX);
    generatedFeelingTags[i].y = startY + row * (chipH + gapY);
    generatedFeelingTags[i].w = chipW;
    generatedFeelingTags[i].h = chipH;
  }
}

function layoutGeneratedScene() {
  let chipW = 160;
  let chipH = 34;
  let gapX = 10;
  let gapY = 10;
  let cols = 3;
  let startX = genSceneBox.x + 10;
  let startY = genSceneBox.y + 10 - genSceneScroll;

  for (let i = 0; i < generatedSceneTags.length; i++) {
    if (generatedSceneTags[i] === draggingTag) continue;

    let col = i % cols;
    let row = floor(i / cols);

    generatedSceneTags[i].x = startX + col * (chipW + gapX);
    generatedSceneTags[i].y = startY + row * (chipH + gapY);
    generatedSceneTags[i].w = chipW;
    generatedSceneTags[i].h = chipH;
  }
}

function layoutSelectedFeeling() {
  let chipW = 102;
  let chipH = 34;
  let gapX = 10;
  let gapY = 10;
  let cols = 2;
  let startX = selFeelingBox.x + 10;
  let startY = selFeelingBox.y + 10 - selFeelingScroll;

  for (let i = 0; i < selectedFeelingTags.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);

    selectedFeelingTags[i].sx = startX + col * (chipW + gapX);
    selectedFeelingTags[i].sy = startY + row * (chipH + gapY);
    selectedFeelingTags[i].sw = chipW;
    selectedFeelingTags[i].sh = chipH;
  }
}

function layoutSelectedScene() {
  let chipW = 210;
  let chipH = 34;
  let gapY = 10;
  let startX = selSceneBox.x + 10;
  let startY = selSceneBox.y + 10 - selSceneScroll;

  for (let i = 0; i < selectedSceneTags.length; i++) {
    selectedSceneTags[i].sx = startX;
    selectedSceneTags[i].sy = startY + i * (chipH + gapY);
    selectedSceneTags[i].sw = chipW;
    selectedSceneTags[i].sh = chipH;
  }
}

function getGeneratedFeelingContentHeight() {
  if (generatedFeelingTags.length === 0) return 0;
  let cols = 3;
  let rows = ceil(generatedFeelingTags.length / cols);
  return rows * 34 + (rows - 1) * 10 + 20;
}

function getGeneratedSceneContentHeight() {
  if (generatedSceneTags.length === 0) return 0;
  let cols = 3;
  let rows = ceil(generatedSceneTags.length / cols);
  return rows * 34 + (rows - 1) * 10 + 20;
}

function getSelectedFeelingContentHeight() {
  if (selectedFeelingTags.length === 0) return 0;
  let cols = 2;
  let rows = ceil(selectedFeelingTags.length / cols);
  return rows * 34 + (rows - 1) * 10 + 20;
}

function getSelectedSceneContentHeight() {
  if (selectedSceneTags.length === 0) return 0;
  return (
    selectedSceneTags.length * 34 + (selectedSceneTags.length - 1) * 10 + 20
  );
}

function computeReading() {
  let scores = {};
  for (let e of EMOTIONS) scores[e] = 0;

  for (let tag of selectedFeelingTags) {
    let weights = feelingWeights[tag.word];
    if (weights) {
      for (let e of EMOTIONS) scores[e] += weights[e] || 0;
    }
  }

  for (let tag of selectedSceneTags) {
    let weights = sceneWeights[tag.word];
    if (weights) {
      for (let e of EMOTIONS) scores[e] += weights[e] || 0;
    }
  }

  let total = 0;
  for (let e of EMOTIONS) total += scores[e];

  if (total <= 0) {
    resultData = null;
    return;
  }

  let temp = [];
  for (let e of EMOTIONS) {
    let raw = (scores[e] / total) * 100;
    temp.push({
      name: e,
      raw: raw,
      floor: floor(raw),
      frac: raw - floor(raw),
    });
  }

  let floorSum = temp.reduce((sum, item) => sum + item.floor, 0);
  let remaining = 100 - floorSum;

  temp.sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < remaining; i++) temp[i].floor += 1;

  let sorted = temp
    .map((item) => ({
      name: item.name,
      percent: item.floor,
      score: scores[item.name],
    }))
    .sort((a, b) => b.score - a.score);

  let primary = sorted[0].name;
  let secondary = sorted[1].name;

  let topFeelings = selectedFeelingTags.slice(0, 3).map((t) => t.word);
  let topScenes = selectedSceneTags.slice(0, 3).map((t) => t.word);

  resultData = {
    primary,
    secondary,
    sorted,
    profileName: getProfileTitle(primary, secondary),
    subtitle: buildSubtitle(primary, secondary),
    description: buildDescription(primary, secondary, topFeelings, topScenes),
    languageLine: buildLanguageLine(topFeelings, topScenes),
  };
}

function getProfileTitle(primary, secondary) {
  return (
    PROFILE_NAMES[`${primary}|${secondary}`] || `The ${primary} ${secondary}`
  );
}

function buildSubtitle(primary, secondary) {
  return `${primary}-leaning with traces of ${secondary.toLowerCase()}.`;
}

function buildDescription(primary, secondary, feelings, scenes) {
  let feelingText =
    feelings.length > 0 ? feelings.join(", ") : "selected emotional language";
  let sceneText =
    scenes.length > 0 ? scenes.join(", ") : "its chosen visual fragments";

  return `This composition reads as ${primary.toLowerCase()} with an undertow of ${secondary.toLowerCase()}. Built from feelings like ${feelingText} and scenes such as ${sceneText}, it suggests a mood that is layered, associative, and quietly self-revealing.`;
}

function buildLanguageLine(feelings, scenes) {
  let f = feelings.length > 0 ? feelings.join(", ") : "—";
  let s = scenes.length > 0 ? scenes.join(", ") : "—";
  return `Feelings: ${f}\nScenes: ${s}`;
}

function getEmotionColor(name) {
  if (name === "Calm") return color("#97B3AE");
  if (name === "Joy") return color("#F4D35E");
  if (name === "Nostalgia") return color("#F2C3B9");
  if (name === "Loneliness") return color("#B5AA9B");
  if (name === "Anxiety") return color("#81B9D8");
  if (name === "Anger") return color("#D96C6C");
  return color("#B8B0A7");
}

function drawResetButton() {
  fill("#5E6F84");
  noStroke();
  rect(width - 118, 12, 92, 34, 11);

  fill(255);
  textAlign(CENTER, CENTER);
  textFont("Arial");
  textStyle(NORMAL);
  textSize(12);
  text("Reset", width - 72, 29);
}

class PaletteCard {
  constructor(x, y, w, h, data) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.data = data;
  }

  display() {
    noStroke();
    fill(this.data.hex);
    rect(this.x, this.y, this.w, this.h, 14);
  }

  contains(px, py) {
    return (
      px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h
    );
  }

  makeDragCopy() {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      data: this.data,
      display: function () {
        noStroke();
        fill(this.data.hex);
        rect(this.x, this.y, this.w, this.h, 14);
      },
    };
  }
}

class TagChip {
  constructor(word, hex, type) {
    this.word = word;
    this.hex = hex;
    this.type = type;
    this.x = 0;
    this.y = 0;
    this.w = type === "scene" ? 160 : 154;
    this.h = 34;
  }

  display() {
    noStroke();
    fill(this.hex);
    rect(this.x, this.y, this.w, this.h, 17);

    fill(255);
    textFont("Arial");
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    textSize(this.type === "scene" ? 10.5 : 11.5);
    text(this.word, this.x + this.w / 2, this.y + this.h / 2);
  }

  displayDragged() {
    noStroke();
    fill(this.hex);
    rect(this.x, this.y, this.w, this.h, 17);

    fill(255);
    textFont("Arial");
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    textSize(this.type === "scene" ? 10.5 : 11.5);
    text(this.word, this.x + this.w / 2, this.y + this.h / 2);
  }

  contains(px, py) {
    return (
      px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h
    );
  }
}

class SelectedTag {
  constructor(word, hex, type) {
    this.word = word;
    this.hex = hex;
    this.type = type;
    this.sx = 0;
    this.sy = 0;
    this.sw = type === "scene" ? 210 : 102;
    this.sh = 34;
  }

  displaySelected() {
    noStroke();
    fill(this.hex);
    rect(this.sx, this.sy, this.sw, this.sh, 15);

    fill(255);
    textFont("Arial");
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    textSize(10.5);
    text(this.word, this.sx + this.sw / 2, this.sy + this.sh / 2);
  }

  containsSelected(px, py) {
    return (
      px > this.sx &&
      px < this.sx + this.sw &&
      py > this.sy &&
      py < this.sy + this.sh
    );
  }
}

function resetAll() {
  generatedFeelingTags = [];
  generatedSceneTags = [];
  selectedFeelingTags = [];
  selectedSceneTags = [];
  resultData = null;

  genFeelingScroll = 0;
  genSceneScroll = 0;
  selFeelingScroll = 0;
  selSceneScroll = 0;
}
