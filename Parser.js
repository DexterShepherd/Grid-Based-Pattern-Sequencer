import { Store } from './Store'
import { Collection } from './Command'

class ParserSingleton {
  getNeighbors(x, y) {
    return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ]
  }

  parse([x, y]) {
    const values = []
    const visited = []
    const stack = [[x, y]]

    while (stack.length) {
      const [x, y] = stack.pop()
      const key = `${x}:${y}`

      if (Store.cells[key] && visited.indexOf(key) == -1) {
        values.push({
          cell: Store.cells[key],
          x,
          y
        })
      }

      visited.push(key)

      for (const [nx, ny] of this.getNeighbors(x, y)) {
        const key = `${nx}:${ny}`
        if (Store.cells[key] && visited.indexOf(key) == -1) {
          stack.push([nx, ny])
        }
      }
    }

    let commands = {}

    values.forEach(({ x, y, cell }) => {
      if (!commands[y]) {
        commands[y] = []
      }
      commands[y].push({ x, cell })
      commands[y] = commands[y].sort((a, b) => a.x - b.x)
    })

    commands = Object.keys(commands).reduce((acc, cur) => [...acc, commands[cur]], [])

    const parsedCommands = []

    const knownCommands = ['P', 'D', 'O', 'C']

    commands.forEach(command => {
      command.forEach(({ cell }) => {
        if (knownCommands.indexOf(cell.value) !== -1) {
          parsedCommands.push({ f: cell.value, a: [] })
        } else {
          parsedCommands[parsedCommands.length - 1].a.push(cell.value)
        }
      })
    })

    Store.commands.push(new Collection(parsedCommands))
  }
}

const Parser = new ParserSingleton()

export { Parser, ParserSingleton }
