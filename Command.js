import { Midi } from './Midi'
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

class Command {
  constructor(obj, collection) {
    this.arguments = obj.a.map(value => numbers.indexOf(value))
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
    this.divider = this.arguments[0]
  }

  tick(currentTick) {
    if (currentTick % this.divider == 0) {
      this.collection.pulse(currentTick)
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
    this.value = this.arguments[this.readPos % this.arguments.length]
  }
}

class Out extends Command {
  constructor(obj, collection) {
    super(obj, collection)
  }
  pulse() {
    if (this.parent.value) {
      Midi.send(this.parent.value)
    }
  }
}

const createCommand = (obj, collection) => {
  switch (obj.f) {
    case 'P':
      return new Pulse(obj, collection)
    case 'D':
      return new Data(obj, collection)
    case 'O':
      return new Out(obj, collection)
  }
}

class Collection {
  constructor(commandObjs) {
    this.commands = commandObjs.map(obj => createCommand(obj, this))
    this.commands.forEach((command, i) => {
      if (i > 0) {
        command.parent = this.commands[i - 1]
      }
    })
  }

  tick(currentTick) {
    this.commands.forEach(command => command.tick(currentTick))
  }

  pulse() {
    this.commands.forEach(command => command.pulse())
  }
}

export { Collection }
