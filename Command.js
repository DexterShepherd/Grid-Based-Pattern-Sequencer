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
    this.parent = null
    this.readPos = 0
    this.fCell.isFunction(true)
    this.aCells.forEach(cell => cell.isFunction(false))
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
    this.aCells[this.index].flash()
  }

  get index() {
    return this.readPos % this.arguments.length
  }

  get value() {
    return this.arguments[this.index]
  }
}

class Out extends Command {
  constructor(obj, collection) {
    super(obj, collection)
  }
  pulse() {
    this.parent.readPos += 1
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

class Send extends Command {
  constructor(obj, collection) {
    super(obj, collection)
    this.id = this.aCells.map(cell => cell.value).join('')
    console.log(this.id)
    this.event = new Event(`send-${this.id}`)
  }
  pulse() {
    this.parent.readPos += 1
    if (this.parent.value && this.collection.canPlay) {
      // Midi.send(this.parent.value)
      window.dispatchEvent(this.event, { value: this.parent.value })
      this.fCell.flash()
    }
  }
}

class Receive extends Command {
  constructor(obj, collection) {
    super(obj, collection)
    this.id = this.aCells.map(cell => cell.value).join('')
    window.addEventListener(`send-${this.id}`, () => this.onEventTrigger())
  }

  onEventTrigger() {
    this.collection.pulse()
    this.fCell.flash()
  }
}

class Switch extends Command {
  constructor(obj, collection) {
    super(obj, collection)
    this._parent
    this._readPos = 0
  }

  pulse() {
    this.counter--
    if (this.counter == 0) {
      this._parent.readPos++
      this.counter = this._parent.value
      this._readPos += 1
    }

    this.aCells[this.index].flash()
  }

  set parent(p) {
    if (p) {
      this._parent = p
      this.counter = p.value
    }
  }

  get index() {
    return this._readPos % this.arguments.length
  }

  get value() {
    return this.arguments[this.index]
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
    case 'S':
      return new Send(obj, collection)
    case 'R':
      return new Receive(obj, collection)
    case 'W':
      return new Switch(obj, collection)
    case '_':
      return new Comment(obj, collection)
  }
}

class Collection {
  constructor(commandObjs, keys, id) {
    this.id = id
    this.keys = keys
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
    if (currentTick % 16 == 0) {
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
