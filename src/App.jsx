import './App.css'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import xIcon from './assets/x.svg';
import oIcon from './assets/o.svg'; // Adjust the path if necessary

const fireConfetti = () => {
  var count = 200;
  var defaults = {
    origin: { y: 0.7 }
  };
  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100
    ,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

const TURNS = {
  X: '+',
  O: 'o'
}

const Square = ({ children, isSelected, updateBoard, index }) => {
  const isPlusSign = children?.props?.children === TURNS.X;
  console.log(isPlusSign);

  console.log("Contenido del cuadrado:", children);


  const className = `square ${isSelected ? 'is-selected' : ''} ${isPlusSign ? 'plus-sign' : ''}`;

  const handleClick = () => {
    updateBoard(index)
  }
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

const LineOfWinner = ({ winnerCombo }) => {
  if (!winnerCombo) return null;

  const winnerComboObj = WINNER_COMBOS.find(comboObj =>
    comboObj.combo.every((val, index) => val === winnerCombo[index])
  );

  if (!winnerComboObj) return null;

  const { top, left, angle, width } = winnerComboObj;

  const style = {
    width: `${width || '90%'}`,
    top: `${top || 0}`,
    left: `${left || 0}`,
    transform: `rotate(${angle || 0}deg)`,
    position: 'absolute',
    transformOrigin: '0% 0%',
  };

  return (
    <div className='line-of-winner h-3' style={style}></div>
  );
};

const WINNER_COMBOS = [
  { combo: [0, 1, 2], top: '13.7%', left: '5%' },
  { combo: [3, 4, 5], top: '47.9%', left: '5%' },
  { combo: [6, 7, 8], top: '82.5%', left: '5%' },
  { combo: [0, 3, 6], top: '5%', left: '17.5%', angle: '90' },
  { combo: [1, 4, 7], top: '5%', left: '52%', angle: '90' },
  { combo: [2, 5, 8], top: '5%', left: '86.5', angle: '90' },
  { combo: [0, 4, 8], top: '2%', left: '5%', angle: '45', width: '130%' },
  { combo: [2, 4, 6], top: '5%', left: '98%', angle: '135', width: '130%' }
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))

  const [turn, setTurn] = useState(TURNS.X)

  const [winner, setWinner] = useState(null)

  const [winnerCombo, setWinnerCombo] = useState(null)

  const [winnerXGames, setWinnerXGames] = useState(0);
  const [winnerOGames, setWinnerOGames] = useState(0);

  const checkWinner = (boardToCheck) => {
    for (const { combo } of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]) {
        setWinner(boardToCheck[a]);
        setWinnerCombo(combo); // Asigna la combinación ganadora a winnerCombo

        if (boardToCheck[a] === TURNS.X) {
          setWinnerXGames(winnerXGames + 1);
        } else {
          setWinnerOGames(winnerOGames + 1);
        }


        return boardToCheck[a];
      }
    }
    return null;
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
  }

  const resetAllGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    setWinnerXGames(0);
    setWinnerOGames(0);
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }


  const updateBoard = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    console.log(newTurn);
    setTurn(newTurn)
    console.log(newBoard);

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      fireConfetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <>
      <main className='board'>
        <h1>Tic Tac Toe</h1>
        <button onClick={resetAllGame}>Reiniciar</button>
        <section className='game relative'>
          {
            board.map((square, index) => {
              return (
                <Square
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  <span className='w-[40px] h-[40px] text-[57px]'>{square}</span>
                </Square>
              )
            })
          }

          {
            winner !== null && winner !== false && (
              <LineOfWinner winnerCombo={winnerCombo} />
            )
          }

        </section>

        <section className='turn w-full'>
          <Square isSelected={turn === TURNS.X}>
            <span className=''>{TURNS.X}</span>
            <span className=''>{winnerXGames}</span>
          </Square>
          <Square isSelected={turn === TURNS.O}>
            <span className=''>{TURNS.O}</span>
            <span className=''>{winnerOGames}</span>
          </Square>
        </section>

        {
          winner !== null && (
            <section className='winner'>
              <div className='text'>
                <h2>
                  {winner === false ? 'Empate' : 'Gano'}
                </h2>
                <header className='win'>
                  {winner && <Square><span className='w-[40px] h-[40px]'>{winner}</span></Square>}
                </header>

                <footer>
                  <button className='!w-auto' onClick={resetGame}>
                    Volver a jugar
                  </button>
                </footer>
              </div>
            </section>
          )
        }
        <section>

        </section>


      </main>


    </>
  )
}

export default App
