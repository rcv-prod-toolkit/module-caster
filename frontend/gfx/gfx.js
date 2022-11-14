const urlSearchParams = new URLSearchParams(window.location.search)
const params = Object.fromEntries(urlSearchParams.entries())

const namespace = 'module-caster'

const set = params.set || 1
const caster = params.caster

const casterOne = document.querySelector('#caster-one')
const casterOneName = casterOne.querySelector('.name')
const casterOneSocial = casterOne.querySelector('.social')
const casterTwo = document.querySelector('#caster-two')
const casterTwoName = casterTwo.querySelector('.name')
const casterTwoSocial = casterTwo.querySelector('.social')

function displayCaster(data) {
  casterOneName.innerHTML = ''
  casterOneSocial.innerHTML = ''
  casterTwoName.innerHTML = ''
  casterTwoSocial.innerHTML = ''

  if (caster !== undefined && caster !== '1') {
    casterOne.style.display = 'none'
  } else {
    casterOne.style.display = 'flex'
  }
  if (caster !== undefined && caster !== '2') {
    casterTwo.style.display = 'none'
  } else {
    casterTwo.style.display = 'flex'
  }

  if (!data.casterSets[set] || data.casterSets[set].length <= 0) return

  casterOneName.innerHTML = data.casterSets[set][0].name
  casterOneSocial.appendChild(
    getSocial(data.casterSets[set][0].platform, data.casterSets[set][0].handle)
  )

  casterTwoName.innerHTML = data.casterSets[set][1].name
  casterTwoSocial.appendChild(
    getSocial(data.casterSets[set][1].platform, data.casterSets[set][1].handle)
  )
}

function getSocial(platform, handle) {
  const span = document.createElement('span')

  const icon =
    platform === 'Twitch'
      ? '<i class="fab fa-twitch"></i>'
      : '<i class="fab fa-twitter"></i>'
  span.innerHTML += icon

  handle = platform === 'Twitch' ? `twitch.tv/${handle}` : `@${handle}`
  span.innerHTML += handle

  return span
}

window.LPTE.onready(async () => {
  const casterData = await window.LPTE.request({
    meta: {
      namespace,
      type: 'request',
      version: 1
    }
  })
  displayCaster(casterData)

  window.LPTE.on(namespace, 'update', (e) => {
    displayCaster(e)
  })
})
