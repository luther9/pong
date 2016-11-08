'use strict';

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// Space between the side edge of the canvas and the paddle.
var EDGE_TO_PADDLE = 5;
// Space between top of canvas and score.
var TOP_TO_SCORE = 50;

/**
   The paddle at either side of the canvas.
   @constructor
   @param {boolean} isLeft - If true, construct the left paddle, otherwise
   construct the right one.
*/
function Paddle(isLeft) {
  this.x = isLeft ? EDGE_TO_PADDLE : canvas.width - EDGE_TO_PADDLE - this.WIDTH;
  this.y = (canvas.height - this.HEIGHT) / 2;
}

Paddle.prototype = {
  constructor: Paddle,
  WIDTH: 20,
  HEIGHT: 100,

  /**
     Move the paddle.
     @param {boolean} isUp - Whether to move up or down.
     @param {number} speed - The number of pixels to move.
  */
  move: function(isUp, speed) {
    this.y = isUp
      ? Math.max(0, this.y - speed)
      : Math.min(canvas.height - this.HEIGHT, this.y + speed);
  },

  render: function() {
    context.fillStyle = '#fff';
    context.fillRect(this.x, this.y, this.WIDTH, this.HEIGHT);
  },
};

/**
   Holds the paddle and score for each player.
   @constructor
   @param {boolean} isLeft - True if this is a human player on the left,
   otherwise, this is the computer player on the right.
*/
function Player(isLeft) {
  this.paddle = new Paddle(isLeft);
  if (isLeft) {
    this.speed = 50;
    this.goal = this.GOAL_WIDTH;
    this.scoreAlign = 'right';
    this.scoreX = canvas.width / 2 - TOP_TO_SCORE;
  } else {
    this.speed = 1.5;
    this.goal = canvas.width - this.GOAL_WIDTH;
    this.scoreAlign = 'left';
    this.scoreX = canvas.width / 2 + TOP_TO_SCORE;
  }
}

Player.prototype = {
  constructor: Player,
  GOAL_WIDTH: EDGE_TO_PADDLE + Paddle.prototype.WIDTH,
  score: 0,

  render: function() {
    this.paddle.render();
    context.font = '100px sans-serif';
    context.textBaseline = 'top';
    context.fillStyle = '#0f0';
    context.fillText(this.score, this.scoreX, TOP_TO_SCORE);
  },

  move: function(isUp) {
    this.paddle.move(isUp, this.speed);
  },
}

/**
   @constructor
*/
function Ball() {
  this.speedX = this.randomSpeed();
  this.speedY = this.randomSpeed();
}

Ball.prototype = {
  constructor: Ball,
  x: canvas.width / 2,
  y: canvas.height / 2,
  RADIUS: 10,

  // Pixels per frame in both x and y dimensions.
  SPEED: 2,

  render: function() {
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(this.x, this.y, this.RADIUS, 0, Math.PI * 2);
    context.fill();
  },

  /**
     @desc Decides on a random speed in the x or y dimension.
  */
  randomSpeed: function() {
    var speed = this.SPEED;
    return Math.random() < 0.5 ? -speed : speed;
  },

  move: function() {
    this.x += this.speedX;
    this.y += this.speedY;
  },

  /**
     @param rectangle {Object}
     @return True iff the Ball collides with the rectangle.
  */
  collides: function(rectangle) {
    return this.x - this.RADIUS < rectangle.x + rectangle.WIDTH
      && this.x + this.RADIUS > rectangle.x
      && this.y - this.RADIUS < rectangle.y + rectangle.HEIGHT
      && this.y + this.RADIUS > rectangle.y;
  },
};

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

var human = new Player(true);
var computer = new Player(false);

var ball = new Ball();

computer.update = function() {
  this.move(ball.y <= this.paddle.y + this.paddle.HEIGHT / 2);
};

function render() {
  human.render();
  computer.render();
  ball.render();
}

function step() {
  ball.move();
  if (ball.collides(human.paddle) || ball.collides(computer.paddle)) {
    ball.speedX = -ball.speedX;
  } else if (ball.x < human.goal) {
    ++computer.score;
    ball = new Ball();
  } else if (ball.x > computer.goal) {
    ++human.score;
    ball = new Ball();
  }
  if (ball.y - ball.RADIUS < 0 || ball.y + ball.RADIUS > canvas.height) {
    ball.speedY = -ball.speedY;
  }

  computer.update();

  canvas.width = canvas.width;
  render();
  animate(step);
}

function keydown(event) {
  switch (event.key) {
  case 'ArrowDown':
    human.move(false);
    break;
  case 'ArrowUp':
    human.move(true);
    break;
  }
}

window.onload = function() {
  window.addEventListener('keydown', keydown);
  animate(step);
};
