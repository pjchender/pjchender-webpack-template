import math from './math'
import {groupBy} from 'lodash/collection'
import people from './people'
import './styles/style.scss'

const button = document.createElement('button')
button.innerText = 'Click Me'
button.onclick = () => {
  // 點擊時才載入 image-viewer.js
  // System.import 會回傳一個 Promise 物件
  System.import('./image-viewer')
  .then(module => {
    console.log('module', module)
  })
}

document.body.appendChild(button)


const managerGroups = groupBy(people, 'manager')

const peopleElement = document.querySelector('.people')
peopleElement.innerHTML = `<pre>${JSON.stringify(managerGroups, null, 2)}</pre>`

const result = document.querySelector('.result')
result.textContent = math.sum(3, 5)
