import { Midi } from './Midi'
import { Store } from './Store'
import er from 'euclidean-rhythms'
import rotate from 'rotate-array'

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
class Command {
  constructor(obj, collection) {
    this.arguments = obj.a.map(([value]) => numbers.indexOf(value))
    this.aCells = obj.a.map(([_, cell]) => cell)
    this.fCell = obj.f[1]
    this.collection = collection
    this.value = 0
    this.parent = null
  }

  tick() {}

  pulse() {}
}

class Pulse extends Command {
  constructor(obj, collection) {
    super(obj, collection)
    this.mode = this.arguments.length > 1 ? 'euclid' : 'div'
    if (this.mode == 'div') {
      this.divider = this.arguments[0]
    } else if (this.mode == 'euclid') {
      this.pattern = rotate(er.getPattern(this.arguments[0], this.arguments[1]), this.arguments[2] || 0)
      this.pos = 0
    }
  }

  tick(currentTick) {
    console.log('!')
    if (this.mode == 'div') {
      if (currentTick % this.divider == 0) {
        this.collection.pulse(currentTick)
      }
    } else if (this.mode == 'euclid') {
      if (this.pattern[this.pos % this.pattern.length]) {
        this.collection.pulse(currentTick)
      }
      this.pos += 1
    }
  }
}

class Data extends Command {
  constructor(obj, collection) {
    super(obj, collection)
    this.readPos = 0
  }
  pulse() {
    this.readPos += 1
    const index = this.readPos % this.arguments.length
    this.value = this.arguments[index]
    this.aCells[index].flash()
  }
}

class Out extends Command {
  constructor(obj, collection) {
    super(obj, collection)
  }
  pulse() {
    if (this.parent.value && this.collection.canPlay) {
      Midi.send(this.parent.value)
      this.fCell.flash()
    }
  }
}

class Comment extends Command {
  constructor(obj, collection) {
    super(obj, collection)
    this.fCell.textColor = this.fCell.commentColor
    this.aCells.forEach(cell => {
      cell.textColor = cell.commentColor
    })
  }
}

class Mute extends Command {
  constructor(obj, collection) {
    super(obj, collection)
  }

  pulse() {
    const choice = Math.floor(Math.random() * 16)
    if (choice < this.arguments[0]) {
      this.collection.canPlay = true
      this.aCells[0].flash()
    } else {
      this.collection.canPlay = false
      this.fCell.flash()
    }
  }
}

const createCommand = (obj, collection) => {
  switch (obj.f[0]) {
    case 'P':
      return new Pulse(obj, collection)
    case 'D':
      return new Data(obj, collection)
    case 'O':
      return new Out(obj, collection)
    case 'M':
      return new Mute(obj, collection)
    case '_':
      return new Comment(obj, collection)
  }
}

class Collection {
  constructor(commandObjs, keys, id) {
    this.id = id
    this.keys = keys
    console.log(keys)
    this.commands = commandObjs.map(obj => createCommand(obj, this))
    this.commands.forEach((command, i) => {
      if (i > 0) {
        command.parent = this.commands[i - 1]
      }
    })
    this.started = false
    this.dead = false
    this.dying = false
    this.canPlay = true

    this.keys.forEach(key => {
      Store.cells[key].flash()
    })
  }

  tick(currentTick) {
    if (currentTick % 4 == 0) {
      this.started = true
      if (this.dying) {
        this.dead = true
      }
    }
    if (this.started) {
      this.commands.forEach(command => command.tick(currentTick))
    }
  }

  pulse(currentTick) {
    this.commands.forEach(command => command.pulse(currentTick))
  }

  stop() {
    this.dying = true
  }
}

export { Collection }
