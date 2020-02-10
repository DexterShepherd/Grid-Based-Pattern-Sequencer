import { Transport } from './Transport'
import { Renderer } from './Renderer'
import "./style.css"


const ready = () => {
  return new Promise((res) => {
    document.addEventListener('DOMContentLoaded', () => {
      res()
    })
  })
}

const main = () => {
  ready().then(() => {
  const renderer = new Renderer("canvas")
  const transport = new Transport(0.1)
  transport.start()
  renderer.render()
  })
}

main()
