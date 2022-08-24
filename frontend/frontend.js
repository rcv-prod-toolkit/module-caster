const namespace = 'module-caster'

document.querySelector('#add-caster-form').addEventListener('submit', (e) => {
  e.preventDefault()

  window.LPTE.emit({
    meta: {
      namespace,
      type: 'add-caster',
      version: 1
    },
    name: document.querySelector('#name').value,
    platform: document.querySelector('#platform').value,
    handle: document.querySelector('#handle').value
  })

  document.querySelector('#name').value = ''
  document.querySelector('#platform').value = 'Twitch'
  document.querySelector('#handle').value = ''
})

document.querySelector('#update-caster-form').addEventListener('submit', (e) => {
  e.preventDefault()

  window.LPTE.emit({
    meta: {
      namespace,
      type: 'set',
      version: 1
    },
    set: 1,
    caster: [
      document.querySelector('#caster-one').value,
      document.querySelector('#caster-two').value
    ]
  })
})

document.querySelector('#update-caster-2-form').addEventListener('submit', (e) => {
  e.preventDefault()

  window.LPTE.emit({
    meta: {
      namespace,
      type: 'set',
      version: 1
    },
    set: 2,
    caster: [
      document.querySelector('#caster-2-one').value,
      document.querySelector('#caster-2-two').value
    ]
  })
})

function deleteCaster(id) {
  window.LPTE.emit({
    meta: {
      namespace,
      type: 'delete-caster',
      version: 1
    },
    id
  })
}

function swap(set = 1) {
  window.LPTE.emit({
    meta: {
      namespace,
      type: 'swop',
      version: 1
    },
    set
  })
}

function unset(set = 1) {
  window.LPTE.emit({
    meta: {
      namespace,
      type: 'unset',
      version: 1
    },
    set
  })
}

async function initUi() {
  const port =  await window.constants.getWebServerPort()
  const location = `http://localhost:${port}/pages/op-module-caster/gfx`

  const apiKey =  await window.constants.getApiKey()

  const set1 = `${location}/gfx.html?set=1${apiKey !== null ? '&apikey=' + apiKey: ''}`
  const set2 = `${location}/gfx/gfx.html?set=2${apiKey !== null ? '&apikey=' + apiKey : ''}`

  document.querySelector('#caster-embed-1').value = set1
  document.querySelector('#caster-embed-2').value = set2

  document.querySelector('#set-1').src = set1
  document.querySelector('#set-2').src = set2

  const data = await window.LPTE.request({
    meta: {
      namespace,
      type: 'request',
      version: 1
    }
  })

  const casterData = await window.LPTE.request({
    meta: {
      namespace,
      type: 'request-caster',
      version: 1
    }
  })

  displayCasterTable(casterData)
  displayCasterSelects(casterData)

  displayData(data)
}

function displayData(data) {
  document.querySelector('#caster-one').value = ''
  document.querySelector('#caster-two').value = ''
  document.querySelector('#caster-2-one').value = ''
  document.querySelector('#caster-2-two').value = ''

  document.querySelector('#caster-one').value = data.casterSets[1][0]?.id || ''
  document.querySelector('#caster-two').value = data.casterSets[1][1]?.id || ''
  document.querySelector('#caster-2-one').value = data.casterSets[2][0]?.id || ''
  document.querySelector('#caster-2-two').value = data.casterSets[2][1]?.id || ''
}

const casterTableBody = document.querySelector('#caster-table')

function displayCasterTable(data) {
  if (data.caster === undefined) return

  casterTableBody.innerHTML = ''

  data.caster.forEach((c) => {
    const row = document.createElement('tr')

    const nameTd = document.createElement('td')
    nameTd.innerText = c.name
    row.appendChild(nameTd)

    const platformTd = document.createElement('td')
    platformTd.innerHTML =
      c.platform === 'Twitch'
        ? '<i class="fab fa-twitch"></i>'
        : '<i class="fab fa-twitter"></i>'
    row.appendChild(platformTd)

    const handleTd = document.createElement('td')
    handleTd.innerText = c.handle
    row.appendChild(handleTd)

    const deleteTd = document.createElement('td')
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn', 'btn-danger')
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
    deleteBtn.onclick = () => {
      deleteCaster(c.id)
    }
    deleteTd.appendChild(deleteBtn)
    row.appendChild(deleteTd)

    casterTableBody.appendChild(row)
  })
}

const casterOne = document.querySelector('#caster-one')
const casterTwo = document.querySelector('#caster-two')
const casterThree = document.querySelector('#caster-2-one')
const casterFour = document.querySelector('#caster-2-two')

function displayCasterSelects(data) {
  if (data.caster === undefined) return

  var length = casterOne.options.length

  for (let i = length - 1; i >= 1; i--) {
    casterOne.options[i] = null
    casterTwo.options[i] = null
    casterThree.options[i] = null
    casterFour.options[i] = null
  }

  data.caster.forEach((c, i) => {
    casterOne.options.add(new Option(c.name, c.id), [i + 1])
    casterTwo.options.add(new Option(c.name, c.id), [i + 1])
    casterThree.options.add(new Option(c.name, c.id), [i + 1])
    casterFour.options.add(new Option(c.name, c.id), [i + 1])
  })
}

window.LPTE.onready(() => {
  initUi()
  window.LPTE.on(namespace, 'update', displayData)
  window.LPTE.on(namespace, 'update-caster-set', (data) => {
    displayCasterTable(data)
    displayCasterSelects(data)
  })
})
