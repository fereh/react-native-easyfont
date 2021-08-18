# Easyfont API

### instrument(name)
### player(instrument, options)

### generatePitchList(...octaves)
### getNotes()
### getOctaves()

## class Player

### constructor(instrument, options)
### prepare(notes)
### play(notes, when)
### stop()
### pause()
### resume()

## class Instrument

### constructor(name)
### prepare(notes, callback)
### play(notes, speed, gain, callback)
### stop(streams)
### pause(streams)
### pauseAll()
### resume(streams)
### resumeAll()
