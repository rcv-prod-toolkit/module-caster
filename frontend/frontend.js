document.querySelector('#add-caster-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const upload = await updateFile(document.querySelector('#logo').files[0], document.querySelector('#name').value)

  window.LPTE.emit({
    meta: {
      namespace: 'module-caster',
      type: 'add-caster',
      version: 1
    },
    logo: upload?.data.name,
    name: document.querySelector('#name').value,
    platform: document.querySelector('#platform').value,
    handle: document.querySelector('#handle').value
  })

  document.querySelector('#logo').value = null
  document.querySelector('.custom-file-label').textContent = 'Choose file'
  document.querySelector('#name').value = ''
  document.querySelector('#platform').value = 'Twitch'
  document.querySelector('#handle').value = ''
})

document
  .querySelector('#update-caster-form')
  .addEventListener('submit', (e) => {
    e.preventDefault()

    window.LPTE.emit({
      meta: {
        namespace: 'module-caster',
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

document
  .querySelector('#update-caster-2-form')
  .addEventListener('submit', (e) => {
    e.preventDefault()

    window.LPTE.emit({
      meta: {
        namespace: 'module-caster',
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
      namespace: 'module-caster',
      type: 'delete-caster',
      version: 1
    },
    id
  })
}

function swap(set = 1) {
  window.LPTE.emit({
    meta: {
      namespace: 'module-caster',
      type: 'swop',
      version: 1
    },
    set
  })
}

function unset(set = 1) {
  window.LPTE.emit({
    meta: {
      namespace: 'module-caster',
      type: 'unset',
      version: 1
    },
    set
  })
}

async function initUi() {
  const server = await window.constants.getWebServerPort()
  const location = `http://${server}/pages/op-module-caster/gfx`

  const apiKey = await window.constants.getApiKey()

  const set1 = `${location}/gfx.html?set=1${
    apiKey !== null ? '&apikey=' + apiKey : ''
  }`
  const set2 = `${location}/gfx.html?set=2${
    apiKey !== null ? '&apikey=' + apiKey : ''
  }`

  document.querySelector('#caster-embed-1').value = set1
  document.querySelector('#caster-embed-1-1').value = set1 + '&caster=1'
  document.querySelector('#caster-embed-1-2').value = set1 + '&caster=2'
  document.querySelector('#caster-embed-2').value = set2
  document.querySelector('#caster-embed-2-1').value = set2 + '&caster=1'
  document.querySelector('#caster-embed-2-2').value = set2 + '&caster=2'

  document.querySelector('#set-1').src = set1
  document.querySelector('#set-2').src = set2

  const data = await window.LPTE.request({
    meta: {
      namespace: 'module-caster',
      type: 'request',
      version: 1
    }
  })

  const casterData = await window.LPTE.request({
    meta: {
      namespace: 'module-caster',
      type: 'request-caster',
      version: 1
    }
  })

  displayCasterTable(casterData)
  displayCasterSelects(casterData)

  displayData(data)

  document.querySelector('#logo').addEventListener('change', (e) => {
    document.querySelector('.custom-file-label').textContent = document.querySelector('#logo').files[0].name
  })
}

function displayData(data) {
  document.querySelector('#caster-one').value = ''
  document.querySelector('#caster-two').value = ''
  document.querySelector('#caster-2-one').value = ''
  document.querySelector('#caster-2-two').value = ''

  document.querySelector('#caster-one').value = data.casterSets[1][0]?.id || ''
  document.querySelector('#caster-two').value = data.casterSets[1][1]?.id || ''
  document.querySelector('#caster-2-one').value =
    data.casterSets[2][0]?.id || ''
  document.querySelector('#caster-2-two').value =
    data.casterSets[2][1]?.id || ''
}

const casterTableBody = document.querySelector('#caster-table')

function displayCasterTable(data) {
  if (data.caster === undefined) return

  casterTableBody.innerHTML = ''

  data.caster.forEach((c) => {
    const row = document.createElement('tr')

    const logoTd = document.createElement('td')
    const logoImg = document.createElement('img')
    logoImg.src = `/pages/op-module-caster/img/${c.logo}`
    logoImg.style.height = '2.3rem'
    logoTd.appendChild(logoImg)
    row.appendChild(logoTd)

    const nameTd = document.createElement('td')
    nameTd.innerText = c.name
    row.appendChild(nameTd)

    const platformTd = document.createElement('td')
    platformTd.innerHTML = `<i class="fab fa-${c.platform.toLowerCase()}"></i>`
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

async function updateFile(file, name) {
  if(!file) return

  const ext = file.name.split('.').pop()

  const form = new FormData()
  form.append('file', file, `module-caster/frontend/img/${name}.${ext}`)
  form.append('path', 'module-caster/frontend/img')

  const response = await fetch('/upload', {
    method: 'POST',
    body: form
  })

  const json = await response.json()

  return json
}

window.LPTE.onready(() => {
  initUi()
  window.LPTE.on('module-caster', 'update', displayData)
  window.LPTE.on('module-caster', 'update-caster-set', (data) => {
    displayCasterTable(data)
    displayCasterSelects(data)
  })
})
