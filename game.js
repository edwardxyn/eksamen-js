const CHARACTERS_URL = 'https://hp-api.onrender.com/api/characters'
const SPELLS_URL = 'https://hp-api.onrender.com/api/spells'

const game = document.getElementById('game')

let allCharacters = []
let allSpells = []

// Fetch data and start
async function fetchGameData() {
    try {
        const characterResponse = await fetch(CHARACTERS_URL)
        const spellResponse = await fetch(SPELLS_URL)

        allCharacters = await characterResponse.json()
        allSpells = await spellResponse.json()

        console.log(allSpells)
        console.log(allCharacters)

    } catch (error) {
        console.error('Failed to load game data:', error)
    }
}

fetchGameData()