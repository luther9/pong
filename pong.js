'use strict';

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// Space between the side edge of the canvas and the paddle.
var EDGE_TO_PADDLE = 5;

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

  // Pixels per key press.
  SPEED: 50,

  move: function(isUp) {
    if (isUp) {
      this.y = Math.max(0, this.y - this.SPEED);
    } else {
      this.y = Math.min(canvas.height - this.HEIGHT, this.y + this.SPEED);
    }
  },

  render: function() {
    context.fillRect(this.x, this.y, this.WIDTH, this.HEIGHT);
  },
};

/**
   Holds the paddle and score for each player.
   @constructor
   @param {boolean} isLeft - True iff this is the player on the left.
*/
function Player(isLeft) {
  this.paddle = new Paddle(isLeft);
}

Player.prototype = {
  constructor: Player,

  render: function() {
    this.paddle.render();
  },

  move: function(isUp) {
    this.paddle.move(isUp);
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

  // Pixels per millisecond in both x and y dimensions.
  SPEED: 0.2,

  render: function() {
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

  move: function(deltaTime) {
    this.x += deltaTime * this.speedX;
    this.y += deltaTime * this.speedY;
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

// Current time.
var time;

function render() {
  context.fillStyle = '#fff';
  human.render();
  computer.render();
  ball.render();
}

function step(timeStamp) {
  if (time) {
    ball.move(timeStamp - time);
  }
  time = timeStamp;

  if (ball.collides(human.paddle) || ball.collides(computer.paddle)) {
    ball.speedX = -ball.speedX;
  }
  if (ball.y - ball.RADIUS < 0 || ball.y + ball.RADIUS > canvas.height) {
    ball.speedY = -ball.speedY;
  }

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
