import math from './math'
import {groupBy} from 'lodash/collection'
import people from './people'

const managerGroups = groupBy(people, 'manager')

const peopleElement = document.querySelector('.people')
peopleElement.innerHTML = `<pre>${JSON.stringify(managerGroups, null, 2)}</pre>`

const result = document.querySelector('.result')
result.textContent = math.sum(3, 5)
