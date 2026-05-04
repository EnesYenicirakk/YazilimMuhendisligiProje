import { useEffect, useMemo, useRef, useState } from 'react'

const GRID_SIZE = 12
const INITIAL_SNAKE = [
  { x: 5, y: 6 },
  { x: 4, y: 6 },
]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const TICK_MS = 150

const randomFood = (snake) => {
  const occupied = new Set(snake.map((segment) => `${segment.x}-${segment.y}`))
  const emptyCells = []

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x}-${y}`
      if (!occupied.has(key)) emptyCells.push({ x, y })
    }
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)] ?? { x: 0, y: 0 }
}

export default function SnakeMiniGame({ onClose }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState(() => randomFood(INITIAL_SNAKE))
  const [running, setRunning] = useState(true)
  const [score, setScore] = useState(0)
  const panelRef = useRef(null)

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setNextDirection(INITIAL_DIRECTION)
    setFood(randomFood(INITIAL_SNAKE))
    setScore(0)
    setRunning(true)
  }

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!running) return undefined

    const interval = window.setInterval(() => {
      setSnake((currentSnake) => {
        const activeDirection = nextDirection
        const head = currentSnake[0]
        const nextHead = {
          x: head.x + activeDirection.x,
          y: head.y + activeDirection.y,
        }

        const hitsWall =
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE

        const bodyToCheck = currentSnake.slice(0, food.x === nextHead.x && food.y === nextHead.y ? currentSnake.length : currentSnake.length - 1)
        const hitsSelf = bodyToCheck.some(
          (segment) => segment.x === nextHead.x && segment.y === nextHead.y,
        )

        if (hitsWall || hitsSelf) {
          setRunning(false)
          return currentSnake
        }

        const ateFood = nextHead.x === food.x && nextHead.y === food.y
        const nextSnake = [nextHead, ...currentSnake]

        if (!ateFood) {
          nextSnake.pop()
        } else {
          setScore((currentScore) => currentScore + 10)
          setFood(randomFood(nextSnake))
        }

        setDirection(activeDirection)
        return nextSnake
      })
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [food, nextDirection, running])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()

      if (key === 'escape') {
        onClose?.()
        return
      }

      const directionMap = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      }

      const next = directionMap[key]
      if (!next) return

      const isReverse = next.x === -direction.x && next.y === -direction.y
      if (!isReverse) {
        event.preventDefault()
        setNextDirection(next)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [direction, onClose])

  const snakeCells = useMemo(() => new Set(snake.map((segment) => `${segment.x}-${segment.y}`)), [snake])

  return (
    <div
      ref={panelRef}
      className="snake-popover"
      tabIndex={-1}
      role="dialog"
      aria-label="Gizli yılan oyunu"
    >
      <div className="snake-popover-header snake-popover-header-sade">
        <button type="button" className="snake-close-button" onClick={onClose} aria-label="Oyunu kapat">
          ?
        </button>
      </div>

      <div className="snake-score-row">
        <span>Skor</span>
        <strong>{score}</strong>
      </div>

      <div
        className="snake-grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
          const x = index % GRID_SIZE
          const y = Math.floor(index / GRID_SIZE)
          const key = `${x}-${y}`
          const isFood = food.x === x && food.y === y
          const isHead = snake[0]?.x === x && snake[0]?.y === y
          const isBody = snakeCells.has(key)

          return (
            <span
              key={key}
              className={`snake-cell ${isBody ? 'snake-body' : ''} ${isHead ? 'snake-head' : ''} ${isFood ? 'snake-food' : ''}`}
            />
          )
        })}
      </div>

      <div className="snake-footer">
        <span>{running ? 'Yön tuşları veya WASD ile oyna' : 'Oyun bitti'}</span>
        <button type="button" className="snake-reset-button" onClick={resetGame}>
          Yeniden Başlat
        </button>
      </div>
    </div>
  )
}
