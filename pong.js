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

Player.prototype.render = function() {
  this.paddle.render();
};

var human = new Player(true);
var computer = new Player(false);

/*
  Following the YAGNI principle. I don't want to split this into a class and
  instance until I know how I'm going to use it. If it turns out that ball may
  be null, we can make a possibly empty constructor with the starting info in
  the prototype. If it turns out that we need multiple balls, the class design
  should become more obvious.
*/
var ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  RADIUS: 10,

  render: function() {
    context.beginPath();
    context.arc(this.x, this.y, this.RADIUS, 0, Math.PI * 2);
    context.fill();
  },
};

function render() {
  context.fillStyle = '#fff';
  human.render();
  computer.render();
  ball.render();
}

window.onload = function() {
  render();
};
