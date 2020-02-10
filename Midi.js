import webmidi from 'webmidi'

class MidiSingleton {
  constructor(portNumber) {
    this.output = null
    webmidi.enable(err => {
      if (err) {
        return console.error(err)
      }
      this.output = webmidi.outputs[portNumber]
    })
  }

  send(note) {
    if (this.output) {
      this.output.playNote(note).stopNote(note, { time: 100 })
    }
  }
}

const Midi = new MidiSingleton(0)

export { Midi }
