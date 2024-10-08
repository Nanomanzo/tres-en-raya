import './App.css'
import { useState } from 'react'
import confetti from 'canvas-confetti'

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
  X: 'x',
  O: 'o'
}

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`
  const handleClick = () => {
    updateBoard(index)
  }
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}
// quiero que LineOfWinner alaprezca aa travez de las posiciones boardToCheck[a] boardToCheck[b] y boardToCheck[c]

const LineOfWinner = ({ winnerCombo }) => {
  if (!winnerCombo) return null;

  // Busca el objeto correspondiente en WINNER_COMBOS
  const winnerComboObj = WINNER_COMBOS.find(comboObj =>
    comboObj.combo.every((val, index) => val === winnerCombo[index])
  );

  // Asegúrate de que se encontró un objeto de combo
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
  { combo: [0, 1, 2], top: '13%', left: '5%' },
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

  const checkWinner = (boardToCheck) => {
    for (const { combo } of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]) {
        setWinner(boardToCheck[a]);
        setWinnerCombo(combo); // Asigna la combinación ganadora a winnerCombo
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

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
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
        <button onClick={resetGame}>Reiniciar</button>
        <section className='game relative'>
          {
            board.map((square, index) => {
              return (
                <Square
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  <span className='w-[40px] h-[40px]'>{square}</span>
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

        <section className='turn'>
          <Square isSelected={turn === TURNS.X}>
            <span className='w-[40px] h-[40px]'>{TURNS.X}</span>
          </Square>
          <Square isSelected={turn === TURNS.O}>
            <span className='w-[40px] h-[40px]'>{TURNS.O}</span>
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
