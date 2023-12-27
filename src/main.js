import kaboom from "kaboom";

kaboom();

loadSprite("plane", "sprites/planeSpriteNew.png");
loadSprite("building", "sprites/buildingSpriteCut.png");
loadSprite("bg", "sprites/bgSpriteCropped.jpg");

loadSound("pass", "sound/pass.mp3");

let highScore = 0;

scene("game", () => {
  const TOWER_GAP = 180;
  let score = 0;
  setGravity(2000);

  add([sprite("bg", { width: width(), height: height() })]);

  const scoreText = add([text(score), pos(12, 12)]);

  const player = add([
    sprite("plane", { flipX: true }),
    scale(0.3),
    pos(100, 50),
    area(),
    body(),
  ]);

  function createBuildings() {
    const offset = rand(-50, 50);
    // bottom building
    add([
      sprite("building"),
      pos(width(), height() / 2 + offset + TOWER_GAP / 2),
      anchor("topleft"),
      scale(0.6),
      area(),
      "building",
      { passed: false },
    ]);

    // top building
    add([
      sprite("building", { flipY: true }),
      pos(width(), height() / 2 + offset - TOWER_GAP / 2),
      anchor("botleft"),
      scale(0.6),
      area(),
      "building",
    ]);
  }

  loop(1.2, () => createBuildings());

  onUpdate("building", (building) => {
    building.move(-300, 0);

    if (building.passed === false && building.pos.x < player.pos.x) {
      building.passed = true;
      score += 1;
      scoreText.text = score;
      play("pass");
    }
  });

  player.onCollide("building", () => {
    addKaboom(player.pos);
    setTimeout(() => {
      const ss = screenshot();
      go("gameover", score, ss);
    }, 300);
  });

  player.onUpdate(() => {
    if (player.pos.y > height()) {
      const ss = screenshot();
      go("gameover", score, ss);
    }
  });

  onKeyPress("space", () => {
    player.jump(400);
  });
  // For Mobile
  onClick(() => {
    player.jump(400);
  });
});

scene("gameover", (score, screenshot) => {
  if (score > highScore) highScore = score;

  loadSprite("gameOverScreen", screenshot);
  add([sprite("gameOverScreen", { width: width(), height: height() })]);

  add([
    text("gameover!\n" + "score: " + score + "\nhigh score: " + highScore, {
      size: 45,
    }),
    pos(width() / 2, height() / 3),
  ]);

  onKeyPress("space", () => {
    go("game");
  });
  // For Mobile
  onClick(() => {
    go("game");
  });
});

go("game");
