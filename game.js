const CHARACTERS_URL = 'https://hp-api.onrender.com/api/characters'
const SPELLS_URL = 'https://hp-api.onrender.com/api/spells'

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

const game = document.getElementById('game')

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

function displayCharacters(character, label) {
    const card = document.createElement('div')
    styleElement(card, {
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: houseColors[character.house] || '#333',
        color: 'white'
    })

    const img = document.createElement('img')
    img.src = character.image || DEFAULT_IMAGE
    styleElement(img, {
        width: '150px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
        height: '250px',
        width: '200px'
    })
    card.appendChild(img)
    card.appendChild(createTextElement('h3', label))
    card.appendChild(createTextElement('h2', character.name))
    card.appendChild(createTextElement('p', 'House: ' + character.house))
    card.appendChild(createTextElement('p', 'HP: ' + character.hp))

    game.appendChild(card)
}

function startGame() {
    game.innerHTML = ''

    styleElement(game, {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '50px'
    })

    const player = getRandomCharacter(allCharacters)
    const enemy = getRandomCharacter(allCharacters)

    displayCharacters(player, 'Player')
    displayCharacters(enemy, 'Enemy')
}

fetchGameData()