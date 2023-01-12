import React from 'react';
import ReactDOM from 'react-dom/client';
import classnames from 'classnames';
import './index.css';

function Square(props) {
  return (
    <button className={classnames({ 'red-color':props.highlight},'square')} onClick={props.onClick}>
      {props.value} 
    </button>
  )
}

class Board extends React.Component { 
  renderSquare(i) {
    return <Square key={i} highlight={this.getIfHighlight(i)} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  getIfHighlight(i){
    if(this.props.winList)
      return this.props.winList.filter(item=>item===i).length? true:false
    return false
  }

  render() {
    const list=[]
    let col=[[],[],[]]
    for(let i=0; i<3; i++){
      for(let j=i*3;j<i*3+3;j++)     
        col[i].push(this.renderSquare(j))
      list.push(<div key={i} className="board-row">{col[i]}</div>)
    }
    return (
      <div>
        {
          list
        /* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props){
    super(props)
    this.state={
      history:[{
        squares:Array(9).fill(null),
        point:''
      }],
      xIsNext:true,
      stepNumber: 0,
      sort:true,
      winnerList:null
    }
  }
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if ((calculateWinner(squares) && calculateWinner(squares).winner) || squares[i]) { 
      return;
    }
    squares[i]=this.state.xIsNext? 'X':'O'
    this.setState({
      history:history.concat([{
        squares:squares,
        point:`行${Math.floor(i/3)+1},列${Math.floor(i%3)+1}`
      }]),
      winnerList:calculateWinner(squares) && calculateWinner(squares).winnerList,
      stepNumber: history.length,
      xIsNext:!this.state.xIsNext})
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + step.point:
        'Go to game start';
      return (
      <li key={move}>
        <button className={classnames({ 'font-bold': this.state.stepNumber===move})} onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>)
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board winList={this.state.winnerList} squares={current.squares} onClick={(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          sort: <button onClick={() => this.setState({ sort:!this.state.sort })}>{this.state.sort?'asc':'desc'}</button>
          <ol>{this.state.sort?moves:moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

var calculateWinner=(squares)=> {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ({winner:squares[a],winnerList:lines[i]});
    }
  }
  return null;
}