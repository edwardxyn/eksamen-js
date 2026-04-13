// Config
const API_URL = 'https://hp-api.onrender.com/api/characters/students'

// DOM references
const output = document.getElementById('output')

//Fetch function
async function fetchData() {
    try {
        const response = await fetch(API_URL)

        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()
        displayData(data)
        console.log(data)

    } catch (error) {
        console.error('something went wrong:', error)
        output.textContent = 'Failed to load data.'
    }  
}

//Display function
function displayData(data) {
    output.innerHTML = ''

    data.forEach(item => {
        const div = document.createElement('div')
        div.textContent = item.name
        output.appendChild(div)
    })
}

// Start
fetchData()
