// ---- CONFIG AND VARIABLES ----
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
let enemyCount = 1
const MAX_HAND = 7

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
    },
    heal: {
        color: '#7fff7f',
        innerText: '❤️ Heal 100 HP'
    },
    shield: {
        color: '#c77fff',
        innerText: '🛡️ Block'
    }
}

// ---- HELPER FUNCTIONS ----
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
        character.maxHp = 500
    } else {
        character.isTeacher = true
        character.hp = 800
        character.maxHp = 800
    }

    character.shield = 0
    character.pendingShield = 0

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
    card.appendChild(createTextElement('p', 'HP: ' + character.hp + ' / ' + character.maxHp))

    if (character.shield > 0) {
        const shieldEl = createTextElement('p', '🛡️ Shield: ' + character.shield)
        styleElement(shieldEl, { color: '#c77fff', fontWeight: 'bold' })
        card.appendChild(shieldEl)
    }

    slot.innerHTML = ''
    slot.appendChild(card)
}

// ---- CARDS ----
function generateCard() {
    const roll = Math.random()
    let type = 'normal'

    if (roll < 0.10) {
        type = 'draw'
    } else if (roll < 0.40) {
        type = 'heal'
    } else if (roll < 0.70) {
        type = 'shield'
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

// ---- BATTLE ----
function enemyAttack() {
    const spell = randomFrom(allSpells)
    let damage = randomDamage()

    if (enemy.isTeacher === true) {
        damage = Math.round(damage * 1.10)
    }

    if (player.shield > 0) {
        player.shield -= 1
        logMessage(`🛡️ ${player.name}'s shield absorbed ${spell.name}!`, '#c77fff')
        return
    }

    player.hp -= damage
    logMessage(`${enemy.name} cast ${spell.name} for ${damage} damage!`, '#ff6b6b')
}

// ---- WIN / LOSE ----
function nextEnemy() {
    enemyCount += 1

    let pool
    if (enemyCount % 5 === 0) {
        pool = allCharacters.filter(c => c.hogwartsStudent === false && c.name !== player.name)
    } else {
        pool = allCharacters.filter(c => c.hogwartsStudent === true && c.name !== player.name && c.name !== enemy.name)
    }

    enemy = getRandomCharacter(pool)
    displayCharacter(enemy, enemySlot)
    logMessage(`⚡ New challenger: ${enemy.name}!`, 'gold')
}

function showGameOver() {
    const overlay = document.createElement('div')
    styleElement(overlay, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        zIndex: '100'
    })

    const title = createTextElement('h1', '💀 Game Over 💀')
    styleElement(title, { color: 'gold', fontSize: '3rem', margin: '0' })
    overlay.appendChild(title)

    const subtitle = createTextElement('p', `You were defeated by ${enemy.name}`)
    styleElement(subtitle, { color: 'white', fontSize: '1.2rem' })
    overlay.appendChild(subtitle)

    const buttonRow = document.createElement('div')
    styleElement(buttonRow, { display: 'flex', gap: '20px', marginTop: '20px' })

    const playAgainBtn = createTextElement('button', 'Play Again')
    styleElement(playAgainBtn, {
        padding: '15px 30px',
        fontSize: '1.1rem',
        backgroundColor: 'gold',
        color: '#1a1a2e',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer'
    })
    playAgainBtn.addEventListener('click', function () {
        location.reload()
    })

    const exitBtn = createTextElement('button', 'Back to Students')
    styleElement(exitBtn, {
        padding: '15px 30px',
        fontSize: '1.1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: 'white',
        border: '2px solid white',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer'
    })
    exitBtn.addEventListener('click', function () {
        window.location.href = 'index.html'
    })

    buttonRow.appendChild(playAgainBtn)
    buttonRow.appendChild(exitBtn)
    overlay.appendChild(buttonRow)

    document.body.appendChild(overlay)
}

// ---- TURN LOOP ----
function playCard(index) {
    const cardData = playerHand[index]
    playerHand.splice(index, 1)

    enemy.hp -= cardData.damage
    logMessage(`${player.name} cast ${cardData.name} for ${cardData.damage} damage!`, '#7fffd4')

    if (cardData.type === 'draw') {
        drawCard()
    } else if (cardData.type === 'heal') {
        const healAmount = 100
        const before = player.hp
        player.hp += healAmount
        if (player.hp > player.maxHp) {
            player.hp = player.maxHp
        }
        const healed = player.hp - before
        logMessage(`${player.name} healed ${healed} HP!`, '#7fff7f')
    } else if (cardData.type === 'shield') {
        player.pendingShield += 1
        logMessage(`${player.name} raised a shield!`, '#c77fff')
    }

    displayCharacter(player, playerSlot)
    displayCharacter(enemy, enemySlot)

    if (enemy.hp <= 0) {
        logMessage(`🏆 ${player.name} defeated ${enemy.name}!`, 'gold')
        nextEnemy()
        drawCard()
        renderHand()
        return
    }

    enemyAttack()

    displayCharacter(player, playerSlot)
    displayCharacter(enemy, enemySlot)

    if (player.hp <= 0) {
        logMessage(`${enemy.name} wins!`, 'gold')
        renderHand()
        showGameOver()
        return
    }

    player.shield += player.pendingShield
    player.pendingShield = 0

    displayCharacter(player, playerSlot)

    drawCard()
    renderHand()
}

// Start
function startGame() {
    const students = allCharacters.filter(c => c.hogwartsStudent === true)
    player = getRandomCharacter(students)
    const remaining = allCharacters.filter(c => c.hogwartsStudent === true && c.name !== player.name)
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