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

function startGame() {
    const player = getRandomCharacter(allCharacters)
    const enemy = getRandomCharacter(allCharacters)

    displayCharacters(player, playerSlot)
    displayCharacters(enemy, enemySlot)
}

fetchGameData()