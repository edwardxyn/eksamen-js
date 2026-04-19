const CHARACTERS_URL = 'https://hp-api.onrender.com/api/characters'
const SPELLS_URL = 'https://hp-api.onrender.com/api/spells'

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

const playerSlot = document.getElementById('player-slot')
const enemySlot = document.getElementById('enemy-slot')

let allCharacters = []
let allSpells = []
let player = null
let enemy = null
let playerHand = []
const MAX_HAND = 10

const houseColors = {
    Gryffindor: '#740001',
    Slytherin: '#1a472a',
    Ravenclaw: '#0e1a40',
    Hufflepuff: '#ecb939',
}

const CARD_TYPES = {
    normal: {
        color: 'gold',
        innerText: ''
    },
    draw: {
        color: '#7fd4ff',
        innerText: '🃏 Draw a card'
    }
}

// ---- HELPERS ----
function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function randomDamage() {
    return Math.floor(Math.random() * 31) + 50
}

function logMessage(text, color) {
    const log = document.getElementById('log')
    const message = createTextElement('p', text)
    styleElement(message, {
        margin: '4px 0',
        color: color || 'white'
    })
    log.prepend(message)
}

// ---- DATA FETCHING ----
async function fetchGameData() {
    try {
        const characterResponse = await fetch(CHARACTERS_URL)
        const spellResponse = await fetch(SPELLS_URL)

        allCharacters = await characterResponse.json()
        allCharacters = allCharacters.filter(c => c.house)
        allSpells = await spellResponse.json()

        startGame()
    } catch (error) {
        console.error('Failed to load game data:', error)
    }
}

// ---- CHARACTER SETUP ----
function getRandomCharacter(array) {
    const index = Math.floor(Math.random() * array.length)
    const character = array[index]

    if (character.hogwartsStudent === true) {
        character.isTeacher = false
        character.hp = 500
    } else {
        character.isTeacher = true
        character.hp = 800
    }

    return character
}

function displayCharacter(character, slot) {
    const card = document.createElement('div')
    styleElement(card, {
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: houseColors[character.house] || '#333',
        color: 'white',
        width: '180px'
    })

    const img = document.createElement('img')
    img.src = character.image || DEFAULT_IMAGE
    styleElement(img, {
        width: '120px',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '8px'
    })

    card.appendChild(img)
    card.appendChild(createTextElement('h2', character.name))
    card.appendChild(createTextElement('p', 'House: ' + character.house))
    card.appendChild(createTextElement('p', 'HP: ' + character.hp))

    slot.innerHTML = ''
    slot.appendChild(card)
}

// ---- CARDS ----
function generateCard() {
    let type = 'normal'
    if (Math.random() < 0.15) {
        type = 'draw'
    }

    return {
        name: randomFrom(allSpells).name,
        damage: randomDamage(),
        type: type
    }
}

function renderCard(cardData, index) {
    const cardType = CARD_TYPES[cardData.type]

    const card = document.createElement('div')
    styleElement(card, {
        width: '140px',
        height: '180px',
        padding: '12px',
        backgroundColor: '#2a2a4e',
        border: '2px solid ' + cardType.color,
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
        flexShrink: '0'
    })

    const name = createTextElement('div', cardData.name)
    styleElement(name, { fontWeight: 'bold', color: cardType.color })

    const damage = createTextElement('div', cardData.damage + ' DMG')
    styleElement(damage, { fontSize: '1.5rem', marginTop: '10px' })

    card.appendChild(name)
    card.appendChild(damage)

    if (cardType.innerText !== '') {
        const specialEffectLable = createTextElement('div', cardType.innerText)
        styleElement(specialEffectLable, { fontSize: '0.8rem', marginTop: '6px', color: cardType.color })
        card.appendChild(specialEffectLable)
    }

    card.addEventListener('click', function () {
        playCard(index)
    })

    return card
}

function drawCard() {
    if (playerHand.length < MAX_HAND) {
        playerHand.push(generateCard())
    }
}

function renderHand() {
    const hand = document.getElementById('hand')
    hand.innerHTML = ''

    for (let i = 0; i < playerHand.length; i++) {
        hand.appendChild(renderCard(playerHand[i], i))
    }
}

function enemyAttack() {
    const spell = randomFrom(allSpells)
    let damage = randomDamage()

    if (enemy.isTeacher === true) {
        damage = Math.round(damage * 1.10)
    }

    player.hp -= damage
    logMessage(`${enemy.name} cast ${spell.name} for ${damage} damage!`, '#ff6b6b')
}

function playCard(index) {
    const cardData = playerHand[index]
    playerHand.splice(index, 1)

    enemy.hp -= cardData.damage
    logMessage(`${player.name} cast ${cardData.name} for ${cardData.damage} damage!`, '#7fffd4')

    displayCharacter(player, playerSlot)
    displayCharacter(enemy, enemySlot)

    if (enemy.hp <= 0) {
        logMessage(`🏆 ${player.name} defeated ${enemy.name}!`, 'gold')
        renderHand()
        return
    }

    if (cardData.type === 'draw') {
        drawCard()
    }

    enemyAttack()

    displayCharacter(player, playerSlot)
    displayCharacter(enemy, enemySlot)

    if (player.hp <= 0) {
        logMessage(`${enemy.name} wins!`, 'gold')
        renderHand()
        return
    }

    drawCard()
    renderHand()
}

function startGame() {
    const students = allCharacters.filter(c => c.hogwartsStudent === true)
    player = getRandomCharacter(students)
    const remaining = allCharacters.filter(c => c.name !== player.name)
    enemy = getRandomCharacter(remaining)

    displayCharacter(player, playerSlot)
    displayCharacter(enemy, enemySlot)

    logMessage(`Battle begins: ${player.name} vs ${enemy.name}!`, 'gold')

    playerHand = []
    for (let i = 0; i < 3; i++) {
        drawCard()
    }
    renderHand()
}

setupLayout()
fetchGameData()