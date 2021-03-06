import WAAClock from 'waaclock'
import { Store } from './Store'

class Transport {
  constructor(tickTime) {
    this.tickTime = tickTime
    this.ctx = new AudioContext()
    this.clock = new WAAClock(this.ctx)
    this.tickCount = 0
  }

  tick() {
    this.tickCount += 1
    Store.commands = Store.commands.filter(command => !command.dead)
    Store.commands.forEach(command => {
      command.tick(this.tickCount)
    })
  }

  start() {
    this.clock.start()
    this.clock.callbackAtTime(() => this.tick(), this.tickTime).repeat(this.tickTime)
  }
}

export { Transport }
