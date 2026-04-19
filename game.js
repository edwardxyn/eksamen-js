const CHARACTERS_URL = 'https://hp-api.onrender.com/api/characters'
const SPELLS_URL = 'https://hp-api.onrender.com/api/spells'

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

const playerSlot = document.getElementById('player-slot')
const enemySlot = document.getElementById('enemy-slot')

let allCharacters = []
let allSpells = []
let player = null
let enemy = null

const houseColors = {
    Gryffindor: '#740001',
    Slytherin: '#1a472a',
    Ravenclaw: '#0e1a40',
    Hufflepuff: '#ecb939',
}

// ---- HELPER FUNCTIONS ----
function randomDamage() {
    return Math.floor(Math.random() * 31) + 50
}

function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function logMessage(text, color) {
    const log = document.getElementById('log')
    const message = createTextElement('p', text)
    styleElement(message, {
        margin: '4px 0',
        color: color || 'white'
    })
    //prepend makes messages appear from below
    log.prepend(message)
}

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

function generateCard() {
    return {
        name: randomFrom(allSpells).name,
        damage: randomDamage()
    }
}

function renderCard(cardData) {
    const card = document.createElement('div')
    styleElement(card, {
        width: '140px',
        height: '180px',
        padding: '12px',
        backgroundColor: '#2a2a4e',
        border: '2px solid gold',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        boxSizing: 'border-box'
    })

    const name = createTextElement('div', cardData.name)
    styleElement(name, { fontWeight: 'bold', color: 'gold' })

    const damage = createTextElement('div', cardData.damage + ' DMG')
    styleElement(damage, { fontSize: '1.5rem', marginTop: '10px' })

    card.appendChild(name)
    card.appendChild(damage)

    card.addEventListener('click', () => playCard(cardData))

    return card
}

function drawHand() {
    const hand = document.getElementById('hand')
    hand.innerHTML = ''

    for (let i = 0; i < 3; i++) {
        hand.appendChild(renderCard(generateCard()))
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

function playCard(cardData) {
    enemy.hp -= cardData.damage
    logMessage(`${player.name} cast ${cardData.name} for ${cardData.damage} damage!`, '#7fffd4')

    displayCharacter(player, playerSlot)
    displayCharacter(enemy, enemySlot)

    if (enemy.hp <= 0) {
        alert(`${player.name} wins!`)
        return
    }

    enemyAttack()

    displayCharacter(player, playerSlot)
    displayCharacter(enemy, enemySlot)

    if (player.hp <= 0) {
        alert(`${enemy.name} wins!`)
        return
    }

    drawHand()
}

function startGame() {
    const students = allCharacters.filter(c => c.hogwartsStudent === true)
    player = getRandomCharacter(students)
    const remaining = allCharacters.filter(c => c.name !== player.name)
    enemy = getRandomCharacter(remaining)

    displayCharacter(player, playerSlot)
    displayCharacter(enemy, enemySlot)

    logMessage(`⚡ Battle begins: ${player.name} vs ${enemy.name}!`, 'gold')

    drawHand()
}

setupLayout()
fetchGameData()