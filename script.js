// Config
const API_URL = 'https://hp-api.onrender.com/api/characters/students'
const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

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

    data.forEach(student => {
        const card = createCard(student)
        output.appendChild(card)
    })
}

// Create Card
function createCard(student) {
    const card = document.createElement('div')

    // Image
    const img = document.createElement('img')
    if (student.image) {
        img.src = student.image
    } else {
        img.src = DEFAULT_IMAGE
    }
    card.appendChild(img)

    // Name
    const name = document.createElement('h2')
    name.textContent = student.name
    card.appendChild(name)

    // Alternative names
    const altNames = document.createElement('p')
    if (student.alternate_names.length > null) {
        altNames.textContent = 'Also known as: ' + student.alternate_names.join(', ')
    } else {
        altNames.textContent = 'No alternative names'
    }
    card.appendChild(altNames)

    // Age
    const age = document.createElement('p')
    if (student.yearOfBirth) {
        age.textContent = 'Born: ' + student.yearOfBirth
    } else {
        age.textContent = 'Birth year unknown'
    }
    card.appendChild(age)

    // Wand info
    const wand = document.createElement('p')
    if (student.wand && student.wand.wood) {
        wand.textContent = 'Wand: ' + student.wand.wood + ', ' + student.wand.core + ', ' + student.wand.length + '"'
    } else {
        wand.textContent = 'Wand: Unknown'
    }
    card.appendChild(wand)

    // House
    const house = document.createElement('p')
    house.textContent = 'House: ' + (student.house || 'Unknown')
    card.appendChild(house)

    // Buttons
    const saveBtn = document.createElement('button')
    saveBtn.textContent = 'Save'
    card.appendChild(saveBtn)

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    card.appendChild(deleteBtn)

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    card.appendChild(editBtn)

    return card
}

// Start
fetchData()
