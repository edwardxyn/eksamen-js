function styleElement(element, styles) {
    for (let key in styles) {
        element.style[key] = styles[key]
    }
}

function createTextElement(tag, text) {
    const element = document.createElement(tag)
    element.textContent = text
    return element
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