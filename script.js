// Config
const API_URL = 'https://hp-api.onrender.com/api/characters/students'
const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

// DOM references
const output = document.getElementById('output')

// Store all students so we can filter without re-fetching
let allStudents = []
// Track active house/age filter
let activeHouse = null
let activeAgeSorting = null

//House colors
const houseColors = {
    Gryffindor: '#740001',
    Slytherin: '#1a472a',
    Ravenclaw: '#0e1a40',
    Hufflepuff: '#ecb939',
}

// Helper: create a text element
function createTextElement(tag, text) {
    const element = document.createElement(tag)
    element.textContent = text
    return element
}

// Helper: style an element
function styleElement(element, styles) {
    for (let key in styles) {
        element.style[key] = styles[key]
    }
}

//Fetch function
async function fetchData() {
    try {
        const response = await fetch(API_URL)

        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()
        allStudents = data
        updateDisplay()

    } catch (error) {
        console.error('something went wrong:', error)
        output.textContent = 'Failed to load data.'
    }  
}

//Display function
function displayData(data) {
    output.innerHTML = ''
    styleElement(output, {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        padding: '15px'
    })

    data.forEach(student => {
        const card = createCard(student)
        output.appendChild(card)
    })
}

// Filter by house
function filterByHouse(house) {
    activeHouse = house
    updateDisplay()
}

// Create house filter cards
function createHouseFilters() {
    const filterContainer = document.getElementById('house-filters')
    styleElement(filterContainer, {
        display: 'flex',
        gap: '15px',
        padding: '20px'
    })

    const houses = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff']

    houses.forEach(house => {
        const houseCard = createTextElement('div', house)
        styleElement(houseCard, {
            padding: '15px 30px',
            backgroundColor: houseColors[house],
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
        })

        houseCard.addEventListener('click', function () {
            if (activeHouse === house) {
                filterByHouse(null)
            } else {
                filterByHouse(house)
            }
        })

        filterContainer.appendChild(houseCard)
    })
}

// One function that handles both filtering and sorting
function updateDisplay() {
    let students = [...allStudents]

    // Filter by house if active
    if (activeHouse) {
        students = students.filter(student => student.house === activeHouse)
    }

    // Sort by age if active
    if (activeAgeSorting === 'youngest') {
        students.sort(function (a, b) {
            return b.yearOfBirth - a.yearOfBirth
        })
    } else if (activeAgeSorting === 'oldest') {
        students.sort(function (a, b) {
            return a.yearOfBirth - b.yearOfBirth
        })
    }

    displayData(students)
}

function handleAgeSorting() {
    const dropdown = document.getElementById('sorting-dropdown')
    activeAgeSorting = dropdown.value || null
    updateDisplay()
}

// Create Card
function createCard(student) {
    const card = document.createElement('div')
    styleElement(card, {
        border: '1px solid gray',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        color: 'white',
        backgroundColor: houseColors[student.house] || '#333'
    })

    // Image
    const img = document.createElement('img')
    img.src = student.image || DEFAULT_IMAGE
    styleElement(img, {
        width: '150px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px'
    })
    card.appendChild(img)

    // Name
    card.appendChild(createTextElement('h2', student.name))

    // Alternative names
    if (student.alternate_names.length > 0) {
        card.appendChild(createTextElement('p', 'Also known as: ' + student.alternate_names.join(', ')))
    } else {
        card.appendChild(createTextElement('p', 'No alternative names'))
    }

    // Age
    if (student.yearOfBirth) {
        card.appendChild(createTextElement('p', 'Born: ' + student.yearOfBirth))
    } else {
        card.appendChild(createTextElement('p', 'Birth year unknown'))
    }

    // Wand info
    if (student.wand && student.wand.wood) {
        card.appendChild(createTextElement('p', 'Wand: ' + student.wand.wood + ', ' + student.wand.core + ', ' + student.wand.length + '"'))
    } else {
        card.appendChild(createTextElement('p', 'Wand: Unknown'))
    }

    // House
    card.appendChild(createTextElement('p', 'House: ' + (student.house || 'Unknown')))

    // Buttons
    card.appendChild(createTextElement('button', 'Save'))
    card.appendChild(createTextElement('button', 'Delete'))
    card.appendChild(createTextElement('button', 'Edit'))

    return card
}

// Start
createHouseFilters()
fetchData()
document.getElementById('sorting-dropdown').addEventListener('change', handleAgeSorting)