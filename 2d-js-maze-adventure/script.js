
var pX = 18; // Player X position
var pY = 438; // Player Y position
var tX = 306; // Triplet enemy X position
var tY = 59; // Triplet enemy Y position

var score = 0; // Scoring mechanic
var lives = 3; // Lives/Health mechanic
var playerSpeed = 6.7777; // Precise speed parameter 
var tripletSpeed = 1.44; 
var isInvincible = false; 
var gameRunning = false;
var canCollectKeys = false;
var collectionDistance = 25; 

var keysHeld = {}; // Used to track keyboard events
// List of walls to allow for easy collision iteration 
var mazeWalls = ["maze","maze1","maze2","maze3","maze4","maze5","maze6","maze7","maze8","maze9","maze10","maze11","maze12","maze13","maze14","maze15","maze16","maze17","maze18"];
var wallData = [];

function loadWallData() {
  wallData = [];
  for (var i = 0; i < mazeWalls.length; i++) {
    try {
      // Logic to store wall positions so we don't have to keep querying the UI
      wallData.push({
        x: getProperty(mazeWalls[i], "x"),
        y: getProperty(mazeWalls[i], "y"),
        w: getProperty(mazeWalls[i], "width"),
        h: getProperty(mazeWalls[i], "height")
      });
    } catch(e) {}
  }
}

// List of keys for collection mechanic 
var keyData = [
  { id: "redkey",   collected: false },
  { id: "greenkey", collected: false },
  { id: "bluekey",  collected: false }
];

function loadKeyData() {
  for (var i = 0; i < keyData.length; i++) {
    keyData[i].x = getProperty(keyData[i].id, "x");
    keyData[i].y = getProperty(keyData[i].id, "y");
    keyData[i].collected = false;
  }
}


onEvent("start_button", "click", function() {
  setScreen("game_screen");
  loadWallData();
  loadKeyData();
  resetGame();
});

onEvent("restart_button", "click", function() {
  setScreen("game_screen");
  loadWallData();
  loadKeyData();
  resetGame();
});

// Keyboard input handling
onEvent("game_screen", "keydown", function(event) {
  if (event.key) { keysHeld[event.key.toLowerCase()] = true; }
});

onEvent("game_screen", "keyup", function(event) {
  if (event.key) { keysHeld[event.key.toLowerCase()] = false; }
});


function resetGame() {
  stopTimedLoop(); //  state management
  gameRunning = false;
  canCollectKeys = false;
  isInvincible = false;
  score = 0;
  lives = 3;
  keysHeld = {};
  updateUI();
  // Iteration used to reset key elements
  for (var i = 0; i < keyData.length; i++) {
    keyData[i].collected = false;
    showElement(keyData[i].id);
  }
  resetPositions();
  gameRunning = true;
  startGameLoop(); // Starts the  loop
  setTimeout(function() { canCollectKeys = true; }, 1000);
}

function resetPositions() {
  pX = 18; pY = 438;
  tX = 306; tY = 59;
  setPosition("player", pX, pY);
  setPosition("triplet", tX, tY);
}

function updateUI() {
  setText("score_display", "Score: " + score);
  setText("lives_display", "Lives: " + lives);
}

// Movement function
function movePlayer() {
  var oldX = pX;
  var oldY = pY;
  // Selection: checking keys
  if (keysHeld["a"] || keysHeld["arrowleft"])  { pX -= playerSpeed; }
  if (keysHeld["d"] || keysHeld["arrowright"]) { pX += playerSpeed; }
  pX = Math.max(0, Math.min(270, pX)); 
  setPosition("player", pX, pY);
  if (isTouchingWall(pX, pY, "player")) { pX = oldX; setPosition("player", pX, pY); }

  if (keysHeld["w"] || keysHeld["arrowup"])   { pY -= playerSpeed; }
  if (keysHeld["s"] || keysHeld["arrowdown"]) { pY += playerSpeed; }
  pY = Math.max(0, Math.min(420, pY)); 
  setPosition("player", pX, pY);
  if (isTouchingWall(pX, pY, "player")) { pY = oldY; setPosition("player", pX, pY); }
}


function startGameLoop() {
  stopTimedLoop();
  timedLoop(50, function() {
    if (!gameRunning) return;
    movePlayer();
    // Enemy pathfinding logic
    if (tX < pX) { tX += tripletSpeed; }
    if (tX > pX) { tX -= tripletSpeed; }
    if (tY < pY) { tY += tripletSpeed; }
    if (tY > pY) { tY -= tripletSpeed; }
    setPosition("triplet", tX, tY);
    if (canCollectKeys) { checkKeyCollection(); }
    checkEnemyCollision();
  });
}

// Collision detection 
function isTouchingWall(cx, cy, id) {
  var pad = 4;
  var charW = getProperty(id, "width") - pad * 2;
  var charH = getProperty(id, "height") - pad * 2;
  var charX = cx + pad;
  var charY = cy + pad;
  // Iteration: checking the list of walls
  for (var i = 0; i < wallData.length; i++) {
    if (charX < wallData[i].x + wallData[i].w && charX + charW > wallData[i].x &&
        charY < wallData[i].y + wallData[i].h && charY + charH > wallData[i].y) {
      return true;
    }
  }
  return false;
}

// Enemy Collision 
function checkEnemyCollision() {
  if (isInvincible || !gameRunning) return;
  var tW = getProperty("triplet", "width");
  var tH = getProperty("triplet", "height");
  var pW = getProperty("player", "width");
  var pH = getProperty("player", "height");
  var pCenterX = pX + (pW / 2);
  var pCenterY = pY + (pH / 2);
  var tCenterX = tX + (tW / 2);
  var tCenterY = tY + (tH / 2);

  // Selection: checking if collision range is met
  if (Math.abs(pCenterX - tCenterX) < (tW / 2 + pW / 2 - 20) && 
      Math.abs(pCenterY - tCenterY) < (tH / 2 + pH / 2 - 20)) {
    lives--;
    updateUI();
    if (lives <= 0) { endGame(false); } 
    else {
      isInvincible = true; // Temporary invincibility 
      canCollectKeys = false;
      resetPositions();
      setTimeout(function() { isInvincible = false; canCollectKeys = true; }, 2000);
    }
  }
}

// Key Collection 
function checkKeyCollection() {
  for (var i = 0; i < keyData.length; i++) {
    if (!keyData[i].collected) {
      var pCenterX = pX + (getProperty("player", "width") / 2);
      var pCenterY = pY + (getProperty("player", "height") / 2);
      var kCenterX = keyData[i].x + (getProperty(keyData[i].id, "width") / 2);
      var kCenterY = keyData[i].y + (getProperty(keyData[i].id, "height") / 2);
      
      if (Math.abs(pCenterX - kCenterX) < collectionDistance && Math.abs(pCenterY - kCenterY) < collectionDistance) {
        keyData[i].collected = true;
        hideElement(keyData[i].id);
        score += 500;
        updateUI();
        if (score >= 1500) endGame(true); // Win Condition
      }
    }
  }
}

// Win/Lose Screens
function endGame(didWin) {
  gameRunning = false;
  stopTimedLoop();
  setScreen("end_screen");
  setText("final_score_label", "Final Score: " + score);
  setText("outcome_label", didWin ? "YOU ESCAPED TUNG TUNG SAHUR!" : "TUNG TUNG SAHUR CAUGHT YOU!");
}