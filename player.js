const log = console.log.bind(console)

const e = function(selector) {
    return document.querySelector(selector)
}

const es = function(selector) {
    return document.querySelectorAll(selector)
}

const bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

const bindAll = function(selector, eventName, callback) {
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

const split = function(s, delimiter = ' ') {
    let l = []
    let space = delimiter.length
    let start = 0
    for (let i = 0; i < s.length; i++) {
        let a = s.slice(i, i + space)
        if (a === delimiter) {
            let n = s.slice(start, i)
            l.push(n)
            start = i + space
        }
    }
    let last = s.slice(start)
    l.push(last)
    return l
}

const choice = function(array) {
    let a = Math.random()
    a = a * array.length
    let i = Math.floor(a)
    return i
}

const rateOfProgress = (a, inner) => {
    setInterval(() => {
        let rate = String(a.currentTime / a.duration * 100) + '%'
        inner.style.width = rate
    }, 1000)
}

const bindEventCanplay = function(audio, src) {
    let a = audio
    a.src = src
    a.addEventListener('canplay', function() {
        a.play()
    })
}

const bindEventPlay = function(audio) {
    let button = e('#id-button-play')
    button.addEventListener('click', function() {
        audio.play()
    })
}

const bindEventPause = function(audio) {
    let button = e('#id-button-pause')
    button.addEventListener('click', function() {
        audio.pause()
    })
}

const formatTime = function(time) {
    let t = Math.floor(time)
    let minute = Math.floor(t / 60)
    let second = t - minute * 60
    second = String(second)
    if (second.length < 2) {
        second = '0' + String(second)
    }

    return `${minute}:${second}`
}

const bindEventTime = function(audio) {
    let currentTime = e('#id-span-currentTime')
    let totalTime = e('#id-span-totalTime')

    let clockId = setInterval(function() {
        currentTime.innerHTML = formatTime(audio.currentTime)
        totalTime.innerHTML = formatTime(audio.duration)
    }, 1000)

    let a = Math.floor(audio.currentTime)
    let b = Math.floor(audio.duration)
    if (a === b) {
        clearInterval(clockId)
    }
}

const bindEventNextSong = function(audio) {
    let a = audio
    let srcList = [
        '给未来的自己-梁静茹.mp3',
        '梦醒时分-梁静茹.mp3',
        '小情歌-苏打绿.mp3',
        '偶阵雨-梁静茹.mp3',
        '丝路-梁静茹.mp3',
    ]
    bindAll('.next', 'click', (event) => {
        let self = event.target
        let offset = Number(self.dataset.offset)
        let i = Number(a.dataset.index)

        let nextIndex = (i + offset + srcList.length) % srcList.length
        a.dataset.index = nextIndex
        let nextSrc = './music/' + srcList[nextIndex]
        bindEventCanplay(a, nextSrc)
    })
}

const bindEventReplay = function(audio) {
    let a = audio
    a.addEventListener('ended', function() {
        a.play()
    })
}

const bindEventSequencePlay = function(audio) {
    let a = audio
    let srcList = [
        '给未来的自己-梁静茹.mp3',
        '梦醒时分-梁静茹.mp3',
        '小情歌-苏打绿.mp3',
        '偶阵雨-梁静茹.mp3',
        '丝路-梁静茹.mp3',
    ]
    a.addEventListener('ended', function() {
        let i = Number(a.dataset.index)
        let nextIndex = (i + 1 + srcList.length) % srcList.length
        a.dataset.index = nextIndex
        let nextSrc = './music/' + srcList[nextIndex]
        bindEventCanplay(a, nextSrc)
    })
}

const bindEventRadomPlay = function(audio) {
    let a = audio
    let srcList = [
        '给未来的自己-梁静茹.mp3',
        '梦醒时分-梁静茹.mp3',
        '小情歌-苏打绿.mp3',
        '偶阵雨-梁静茹.mp3',
        '丝路-梁静茹.mp3',
    ]
    a.addEventListener('ended', function() {
        let i = choice(srcList)
        nextSrc = './music/' + srcList[i]
        a.dataset.index = i
        bindEventCanplay(a, nextSrc)
    })
}

const bindEventRange = function(audio) {
    let a = audio
    let inner = e('.inner')
    let outer = e('.outer')
    let dot = e('.dot')
    let max = outer.offsetWidth
    let moving = false

    let offset = 0

    rateOfProgress(a, inner)

    dot.addEventListener('mousedown', (event) => {
        offset = event.clientX - dot.offsetLeft
        moving = true
    })

    dot.addEventListener('mouseup', (event) => {
        moving = false
        let width = Number(inner.style.width.slice(0, -1))
        a.currentTime = a.duration * width / 100
        a.play()
    })

    document.addEventListener('mousemove', (event) => {
        if (moving) {
            let x = event.clientX - offset
            if (x > max) {
                x = max
            }
            if (x < 0) {
                x = 0
            }
            let width = (x / max) * 100
            inner.style.width = String(width) + '%'
        }
    })
}

const bindEventSongDetail = (audio) => {
    let a = audio
    a.addEventListener('canplay', () => {
        let songList = [
            '给未来的自己-梁静茹.mp3',
            '梦醒时分-梁静茹.mp3',
            '小情歌-苏打绿.mp3',
            '偶阵雨-梁静茹.mp3',
            '丝路-梁静茹.mp3',
        ]
        let imgs = ['0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg', ]
        let i = Number(a.dataset.index)
        let imgsrc = './music/' + imgs[i]
        let song = songList[i].split('-')[0]
        let artist = songList[i].split('-')[1].split('.')[0]

        e('#id-img-cover').src = imgsrc
        e('#id-div-song').innerHTML = song
        e('#id-div-artist').innerHTML = artist
    })

}

const bindEvents = function() {
    let audio = e('#id-audio-player')
    bindEventPlay(audio)
    bindEventPause(audio)
    bindEventTime(audio)
    bindEventNextSong(audio)
    bindEventReplay(audio)
    bindEventRange(audio)
        // bindEventPlayOrder(audio)
    bindEventSongDetail(audio)

}

const __main = function() {
    bindEvents()
}

__main()