const TRACK_LENGTH = 70
const startBtn = document.getElementById(`startBtn`)
const messageEl = document.getElementById(`message`)
const trackEl = document.getElementById(`track`)
const logListEl = document.getElementById(`logList`)

let tortoisePosition = 1
let harePosition = 1
let raceIntervalId = null
let stepCount = 0
let gameLog = []

startBtn.addEventListener("click", startRace)

function startRace(){
    messageEl.textContent = "BANG!! AND THEY'RE OFF!"
    startBtn.disabled = true

    if (raceIntervalId !== null){
        clearInterval(raceIntervalId)
    }

    tortoisePosition = 1
    harePosition = 1
    stepCount = 0
    gameLog = []
    renderLog()

    raceIntervalId = setInterval(raceStep, 1000)
}

function raceStep(){
    stepCount++

    let tortoiseBefore = tortoisePosition   // new
    let hareBefore = harePosition           // new

    moveTortoise()
    moveHare()
    clampPosition()

    // new block — build and push log entry
    let tortoiseChange = tortoisePosition - tortoiseBefore
    let hareChange = harePosition - hareBefore
    let tortoiseDesc = describeTortoiseMove(tortoiseChange)
    let hareDesc = describeHareMove(hareChange)
    gameLog.push(`Turn ${stepCount}: 🐢 ${tortoiseDesc}, 🐇 ${hareDesc}`)

    renderTrack()
    renderLog()

    if (tortoisePosition >= TRACK_LENGTH || harePosition >= TRACK_LENGTH){
        clearInterval(raceIntervalId)
        raceIntervalId = null
        showResult()
        startBtn.disabled = false
    }
}

function moveTortoise(){
    let roll = Math.floor(Math.random() * 10) + 1

    if (roll <= 5){
        tortoisePosition += 3
    } else if (roll <= 7){
        tortoisePosition -= 2
    } else {
        tortoisePosition += 2
    }
}

function moveHare(){
    let roll = Math.floor(Math.random() * 10) + 1

    if (roll <= 2){
        // nap
    } else if (roll <= 4){
        harePosition += 6
    } else if (roll <= 6){
        harePosition -= 4
    } else if (roll <= 8){
        harePosition += 3
    } else {
        harePosition += 2
    }
}

// new function
function describeTortoiseMove(change){
    if (change === 3)  return `steady plod (+3)`
    if (change === -2) return `slipped (-2)`
    if (change === 2)  return `fast plod (+2)`
    return `moved ${change > 0 ? "+" : ""}${change}`
}

// new function
function describeHareMove(change){
    if (change === 0)  return `took a nap`
    if (change === 6)  return `big hop (+6)`
    if (change === -4) return `slipped (-4)`
    if (change === 3)  return `regular plod (+3)`
    if (change === 2)  return `small plod (+2)`
    return `moved ${change > 0 ? "+" : ""}${change}`
}

function clampPosition(){
    tortoisePosition = Math.min(TRACK_LENGTH, Math.max(1, tortoisePosition))
    harePosition = Math.min(TRACK_LENGTH, Math.max(1, harePosition))
}

function renderTrack(){
    trackEl.innerHTML = ``

    for (let i = 1; i <= TRACK_LENGTH; i++){
        let cell = document.createElement(`div`)
        cell.classList.add(`cell`)

        let isTortoiseHere = tortoisePosition === i
        let isHareHere = harePosition === i

        if (isTortoiseHere && isHareHere){
            cell.classList.add(`both`)
            cell.textContent = `🔥`
        } else if (isTortoiseHere){
            cell.classList.add(`tortoise`)
            cell.textContent = `🐢`
        } else if (isHareHere){
            cell.classList.add(`hare`)
            cell.textContent = `🐇`
        }
        trackEl.appendChild(cell)
    }
}

function renderLog(){
    logListEl.innerHTML = ``

    for (let i = 0; i < gameLog.length; i++){
        let li = document.createElement(`li`)
        li.classList.add(`entry`)
        li.textContent = gameLog[i]
        logListEl.appendChild(li)
    }

    logListEl.parentElement.scrollTop = logListEl.parentElement.scrollHeight
}

function showResult(){
    if (tortoisePosition >= TRACK_LENGTH && harePosition >= TRACK_LENGTH){
        messageEl.textContent = `It's a tie! 🔥`
    } else if (tortoisePosition >= TRACK_LENGTH){
        messageEl.textContent = `TORTOISE WINS!! YAY! 🐢`
    } else if (harePosition >= TRACK_LENGTH){
        messageEl.textContent = `Hare wins... Okay. 🐇`
    } else {
        messageEl.textContent = `The race has stopped.`
    }
}

renderTrack()