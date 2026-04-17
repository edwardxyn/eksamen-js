// ---- CONFIG AND VARIABLES ----
const API_URL = 'https://hp-api.onrender.com/api/characters/students'
const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

const output = document.getElementById('output')

let allStudents = []
let activeHouse = null
let activeAgeSorting = null

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

// ---- DATA FUNCTIONS ----
async function fetchData() {
    try {
        const response = await fetch(API_URL)

        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()
        allStudents = data
        loadCustomStudents()
        displayFavorites()
        updateDisplay()

    } catch (error) {
        console.error('something went wrong:', error)
        output.textContent = 'Failed to load data.'
    }  
}

function saveCustomStudents() {
    const customStudents = allStudents.filter(student => student.custom === true)
    localStorage.setItem('customStudents', JSON.stringify(customStudents))
}

function loadCustomStudents() {
    const saved = localStorage.getItem('customStudents')
    if (saved) {
        const customStudents = JSON.parse(saved)
        customStudents.forEach(student => {
            allStudents.push(student)
        })
    }
}

function getFavorites() {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
}

function saveFavorite(student) {
    const favorites = getFavorites()
    favorites.push(student)
    localStorage.setItem('favorites', JSON.stringify(favorites))
    displayFavorites()
}

function removeFavorite(name) {
    let favorites = getFavorites()
    favorites = favorites.filter(student => student.name !== name)
    localStorage.setItem('favorites', JSON.stringify(favorites))
    displayFavorites()
    updateDisplay()
}

function deleteStudent(name) {
    allStudents = allStudents.filter(student => student.name !== name)

    saveCustomStudents()

    removeFavorite(name)

    displayFavorites()
    updateDisplay()
}

function updateStudent(oldName, updatedData) {
    const student = allStudents.find(s => s.name === oldName)
    if (student) {
        student.name = updatedData.name
        student.house = updatedData.house
        student.yearOfBirth = updatedData.yearOfBirth
    }

    // Update localStorage for custom students
    saveCustomStudents()

    // Update localStorage for favorites
    let favorites = getFavorites()
    const favIndex = favorites.findIndex(fav => fav.name === oldName)
    if (favIndex !== -1) {
        favorites[favIndex].name = updatedData.name
        favorites[favIndex].house = updatedData.house
        favorites[favIndex].yearOfBirth = updatedData.yearOfBirth
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }

    displayFavorites()
    updateDisplay()
}

// ---- DISPLAY FUNCTIONS ----
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

function updateDisplay() {
    let students = [...allStudents]

    if (activeHouse) {
        students = students.filter(student => student.house === activeHouse)
    }

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
    const saveBtn = createTextElement('button', '🤍')
    const favorites = getFavorites()
    if (favorites.some(fav => fav.name === student.name)) {
    saveBtn.textContent = '❤️'
    }
    saveBtn.addEventListener('click', function () {
        const currentFavs = getFavorites()
        const alreadySaved = currentFavs.some(fav => fav.name === student.name)

        if (alreadySaved) {
            removeFavorite(student.name)
            saveBtn.textContent = '🤍'
        } else {
            if (currentFavs.length >= 3) {
                alert('You can only save up to 3 students! Remove one first.')
                return
            }
            saveFavorite(student)
            saveBtn.textContent = '❤️'
        }
    })
    card.appendChild(saveBtn)

    const deleteBtn = createTextElement('button', 'Delete')
    deleteBtn.addEventListener('click', function () {
        deleteStudent(student.name)
    })
    card.appendChild(deleteBtn)

    const editBtn = createTextElement('button', 'Edit')
    editBtn.addEventListener('click', function () {
        card.innerHTML = ''

        // Name input
        const nameInput = document.createElement('input')
        nameInput.type = 'text'
        nameInput.value = student.name
        card.appendChild(nameInput)

        // House dropdown
        const houseSelect = document.createElement('select')
        const houses = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff']
        houses.forEach(house => {
            const option = document.createElement('option')
            option.value = house
            option.textContent = house
            if (house === student.house) option.selected = true
            houseSelect.appendChild(option)
        })
    card.appendChild(houseSelect)

    // Age input
    const ageInput = document.createElement('input')
    ageInput.type = 'number'
    ageInput.value = student.yearOfBirth || ''
    card.appendChild(ageInput)

    // Save button
    const saveEditBtn = createTextElement('button', 'Save')
    saveEditBtn.addEventListener('click', function () {
        const oldName = student.name
        updateStudent(oldName, {
            name: nameInput.value,
            house: houseSelect.value,
            yearOfBirth: Number(ageInput.value) || null
        })
    })
    card.appendChild(saveEditBtn)

    // Cancel button
    const cancelBtn = createTextElement('button', 'Cancel')
    cancelBtn.addEventListener('click', function () {
        updateDisplay()
        displayFavorites()
    })
    card.appendChild(cancelBtn)
})
card.appendChild(editBtn)

    return card
}

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

function displayFavorites() {
    const savedList = document.getElementById('saved-list')
    savedList.innerHTML = ''
    const favorites = getFavorites()
    
    styleElement(savedList, {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        padding: '15px'
    })
    
    favorites.forEach(student => {
        const card = createCard(student)
        savedList.appendChild(card)
    })
}

// ---- USER ACTION ----
function filterByHouse(house) {
    activeHouse = house
    updateDisplay()
}

function handleAgeSorting() {
    const dropdown = document.getElementById('sorting-dropdown')
    activeAgeSorting = dropdown.value || null
    updateDisplay()
}

function createStudent() {
    const name = document.getElementById('input-name').value
    const yearOfBirth = document.getElementById('input-age').value
    const house = document.getElementById('input-house').value
    const wood = document.getElementById('input-wood').value
    const core = document.getElementById('input-core').value
    const length = document.getElementById('input-length').value
 
    if (!name || !yearOfBirth || !house || !wood) {
        alert('Please fill in all fields')
        return
    }
 
    const newStudent = {
        name: name,
        yearOfBirth: Number(yearOfBirth),
        house: house,
        image: DEFAULT_IMAGE,
        alternate_names: [],
        wand: {
            wood: wood,
            core: core,
            length: length
        },
        custom: true
    }
 
    allStudents.push(newStudent)
    saveCustomStudents()
    updateDisplay()
 
    // Clear inputs
    document.getElementById('input-name').value = ''
    document.getElementById('input-age').value = ''
    document.getElementById('input-wood').value = ''
    document.getElementById('input-core').value = ''
    document.getElementById('input-length').value = ''
}

// Start
createHouseFilters()
fetchData()
document.getElementById('sorting-dropdown').addEventListener('change', handleAgeSorting)
document.getElementById('create-btn').addEventListener('click', createStudent)