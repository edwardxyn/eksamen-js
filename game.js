const CHARACTERS_URL = 'https://hp-api.onrender.com/api/characters'
const SPELLS_URL = 'https://hp-api.onrender.com/api/spells'

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

const playerSlot = document.getElementById('player-slot')
const enemySlot = document.getElementById('enemy-slot')

let allCharacters = []
let allSpells = []

const houseColors = {
    Gryffindor: '#740001',
    Slytherin: '#1a472a',
    Ravenclaw: '#0e1a40',
    Hufflepuff: '#ecb939',
}

// ---- HELPER FUNCTIONS ----
function createTextElement(tag, text) {
    const element = document.createElement(tag)
    element.textContent = text
    return element
}

function styleElement(element, styles) {
    for (let key in styles) {
        element.style[key] = styles[key]
    }
}

async function fetchGameData() {
    try {
        const characterResponse = await fetch(CHARACTERS_URL)
        const spellResponse = await fetch(SPELLS_URL)

        allCharacters = await characterResponse.json()
        allCharacters = allCharacters.filter(c => c.house)
        allSpells = await spellResponse.json()

        startGame()
        console.log(allCharacters)

    } catch (error) {
        console.error('Failed to load game data:', error)
    }
}

function getRandomCharacter(array) {
    const index = Math.floor(Math.random() * array.length)
    const character = array.splice(index, 1)[0]

    if (character.hogwartsStudent === true) {
        character.hp = 500
    } else {
        character.hp = 800
    }

    return character
}

function displayCharacters(character, slot) {
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

function setupLayout() {
    styleElement(document.documentElement, {
        margin: '0',
        height: '100vh',
        overflow: 'hidden'
    })

    styleElement(document.body, {
        margin: '0',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#1a1a2e',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
    })

    const main = document.querySelector('main')
    styleElement(main, {
        flex: '1',
        display: 'flex',
        flexDirection: 'row',
        padding: '15px',
        gap: '15px',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        minHeight: '0',
        boxSizing: 'border-box'
    })

    const log = document.getElementById('log')
    styleElement(log, {
        width: '280px',
        flexShrink: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '15px',
        borderRadius: '10px',
        overflowY: 'auto',
        fontSize: '0.9rem',
        display: 'flex',
        flexDirection: 'column-reverse',
        boxSizing: 'border-box'
    })

    const rightSide = document.getElementById('right-side')
    styleElement(rightSide, {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        minWidth: '0'
    })

    const arena = document.getElementById('arena')
    styleElement(arena, {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '20px',
        borderRadius: '15px'
    })

    const vs = document.getElementById('vs')
    styleElement(vs, {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'gold'
    })

    const hand = document.getElementById('hand')
    styleElement(hand, {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        height: '200px',
        flexShrink: '0'
    })
}

function startGame() {
    const player = getRandomCharacter(allCharacters)
    const enemy = getRandomCharacter(allCharacters)

    displayCharacters(player, playerSlot)
    displayCharacters(enemy, enemySlot)
}

setupLayout()
fetchGameData()