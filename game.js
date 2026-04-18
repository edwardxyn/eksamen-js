const CHARACTERS_URL = 'https://hp-api.onrender.com/api/characters'
const SPELLS_URL = 'https://hp-api.onrender.com/api/spells'

const game = document.getElementById('game')

let allCharacters = []
let allSpells = []

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
        allSpells = await spellResponse.json()

        startGame()

    } catch (error) {
        console.error('Failed to load game data:', error)
    }
}

function getRandomCharacter(array) {
    const index = Math.floor(Math.random() * array.length)
    return array[index]
}

function buildTeam() {
    const teachers = allCharacters.filter(c => c.hogwartsStaff === true)
    const students = allCharacters.filter(c => c.hogwartsStudent === true)

    const team = []

    const student1 = getRandomCharacter(students)
    student1.hp = 500
    team.push(student1)

    const teacher = getRandomCharacter(teachers)
    teacher.hp = 800
    team.push(teacher)

    const student2 = getRandomCharacter(students)
    student2.hp = 500
    team.push(student2)

    console.log(teachers)
    console.log(students)

    return team
}

function displayTeam(team, label) {
    const container = document.createElement('div')
    container.appendChild(createTextElement('h2', label))
    styleElement(container, {
        display: 'flex',
        gap: '15px',
        padding: '15px'
    })

    team.forEach(character => {
        const card = document.createElement('div')

        card.appendChild(createTextElement('h3', character.name))
        card.appendChild(createTextElement('p', 'HP: ' + character.hp))

        container.appendChild(card)
    })

    game.appendChild(container)
}

function startGame() {
    game.innerHTML = ''

    const team1 = buildTeam()
    const team2 = buildTeam()

    displayTeam(team1, 'Team 1')
    displayTeam(team2, 'Team 2')
}

fetchGameData()