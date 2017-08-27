import React, { Component } from 'react';
import classNames from 'classnames';
import './Content.less';

const gameStageArea = {
  width: 50,
  height: 20,
};

const direction = {
  left: 37,
  top: 38,
  right: 39,
  bottom: 40,
};

const gameTimeout = 200;

const defaultState = {
  direction: direction.right,
  snake: [457, 456, 455],
  timeoutId: undefined,
  canUpdateDirection: true,
  point: 232,
};

export default class Content extends Component {
  constructor() {
    super();
    this.state = {
      stage: this.generateStage(),
      ...defaultState,
    };
  }

  generateStage = () => Array.from(Array(gameStageArea.height))
    .map((valRow, rowIndex) => (
      Array.from(Array(gameStageArea.width))
        .map((valCol, colIndex) => ({
          id: (rowIndex * gameStageArea.width) + colIndex,
          key: `block${(rowIndex * gameStageArea.width) + colIndex}`,
        }))
    ));

  resetGame = () => {
    this.setState(defaultState);
  }

  gameStart = () => {
    this.setState({ timeoutId: setTimeout(this.updateGame, gameTimeout) });
  }

  gameOver = () => {
    clearTimeout(this.state.timeoutId);
    this.setState({ timeoutId: undefined });
  }

  isGameEnd = (newSnake, oldSnake) => {
    let isEnd = false;
    const newSnakeHead = newSnake[0];
    const oldSnakeHead = oldSnake[0];
    const headCount = newSnake.reduce((acc, val) => { if (val === newSnakeHead) { return acc + 1; } return acc; }, 0);
    if (headCount > 1) {
      isEnd = true;
    }
    if (newSnakeHead < 0 || newSnakeHead > ((gameStageArea.height * gameStageArea.width) - 1)) {
      isEnd = true;
    }
    if (newSnakeHead - 1 === oldSnakeHead && newSnakeHead % gameStageArea.width === 0) {
      isEnd = true;
    }
    if (newSnakeHead + 1 === oldSnakeHead && oldSnakeHead % gameStageArea.width === 0) {
      isEnd = true;
    }
    return isEnd;
  }


  shouldUpdatePoint = () => this.state.snake[0] === this.state.point;

  genreateNewPoint = () => {
    let newPoint;
    const hasDuplicatePoint = () => this.state.snake.find(snakeId => snakeId === newPoint);
    do {
      newPoint = Math.floor(Math.random() * gameStageArea.height * gameStageArea.width);
    } while (hasDuplicatePoint());
    this.setState({ point: newPoint });
  }

  updateGame = () => {
    const newSnake = [...this.state.snake];
    switch (this.state.direction) {
      case direction.left:
        newSnake.unshift(newSnake[0] - 1);
        break;
      case direction.right:
        newSnake.unshift(newSnake[0] + 1);
        break;
      case direction.top:
        newSnake.unshift(newSnake[0] - gameStageArea.width);
        break;
      case direction.bottom:
        newSnake.unshift(newSnake[0] + gameStageArea.width);
        break;
      default:
    }
    if (this.isGameEnd(newSnake, this.state.snake)) {
      this.gameOver();
      alert('game over');
      this.resetGame();
      return;
    }
    if (this.shouldUpdatePoint()) {
      this.genreateNewPoint();
    } else {
      newSnake.pop();
    }

    this.setState({ snake: newSnake, canUpdateDirection: true });
    setTimeout(this.updateGame, gameTimeout);

  }

  onKeyDown = (e) => {
    let shouldUpdateDirection = false;
    switch (e.keyCode) {
      case direction.left:
        if (this.state.direction !== direction.right) {
          shouldUpdateDirection = true;
        }
        break;
      case direction.top:
        if (this.state.direction !== direction.bottom) {
          shouldUpdateDirection = true;
        }
        break;
      case direction.bottom:
        if (this.state.direction !== direction.top) {
          shouldUpdateDirection = true;
        }
        break;
      case direction.right:
        if (this.state.direction !== direction.left) {
          shouldUpdateDirection = true;
        }
        break;
      default:
        break;
    }
    if (shouldUpdateDirection && this.state.canUpdateDirection) {
      this.setState({ direction: e.keyCode, canUpdateDirection: false });
    }
    if (!this.state.timeoutId) {
      this.gameStart();
    }
  }

  render() {
    console.log(this.state.snake);
    return (
      <div className="content">
        <div id="stage" onKeyDown={this.onKeyDown} tabIndex="0">
          {
            this.state.stage.map((stageRow, rowIndex) => <div className="stageRow" key={`stageRow${rowIndex}`}>
              {
                stageRow.map(stageCol =>
                  <div
                    className={classNames('stageCol',
                      {
                        snake: Number.isInteger(this.state.snake.find(snakeId => stageCol.id === snakeId)),
                        point: this.state.point === stageCol.id,
                      }
                    )}
                    onClick={() => { console.log(stageCol.id); }}
                    key={stageCol.key}
                  />
                )
              }
            </div>)
          }
        </div>
        <div>點一下黑色區域以後就可以用上下左右操控</div>
      </div>
    );
  }
}
