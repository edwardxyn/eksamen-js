// Config
const API_URL = 'https://hp-api.onrender.com/api/characters/students'
const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

// DOM references
const output = document.getElementById('output')

// Store all students so we can filter without re-fetching
let allStudents = []

//House colors
const houseColors = {
    Gryffindor: '#740001',
    Slytherin: '#1a472a',
    Ravenclaw: '#0e1a40',
    Hufflepuff: '#ecb939'
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
        displayData(allStudents)

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
    if (house) {
        const filtered = allStudents.filter(student => student.house === house)
        displayData(filtered)
    } else {
        displayData(allStudents)
    }
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
fetchData()
