import React, { Component } from 'react';
import './Content.less';

const gameStageArea = {
  width: 50,
  height: 20,
};

export default class Content extends Component {
  constructor() {
    super();
    this.state = {
      stage: this.generateStage(),
    };
  }
  generateStage = () => Array.from(Array(gameStageArea.height))
    .map((valRow, rowIndex) => (
      Array.from(Array(gameStageArea.width))
        .map((valCol, colIndex) => (
          { id: (rowIndex * gameStageArea.width) + colIndex, key: `block${(rowIndex * gameStageArea.width) + colIndex}` }
        ))
    ));

  render() {
    return (
      <div className="content">
        <div id="stage">
          {
            this.state.stage.map((stageRow, rowIndex) => <div className="stageRow" key={`stageRow${rowIndex}`}>
              {stageRow.map(stageCol => <div className="stageCol" key={stageCol.key} />)}
            </div>)
          }
        </div>
      </div>
    );
  }
}
