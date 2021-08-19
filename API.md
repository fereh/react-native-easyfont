## Classes

<dl>
<dt><a href="#Instrument">Instrument</a></dt>
<dd><p>Abstract collection of related &#39;soundfonts&#39;.
Frontend for Android&#39;s <code>SoundPool</code> with safety checks and convenience features.</p>
</dd>
<dt><a href="#Player">Player</a></dt>
<dd><p>Manages the playback notes in an instrument.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getNotes">getNotes()</a></dt>
<dd><p>List of possible notes for soundfonts.</p>
</dd>
<dt><a href="#getOctaves">getOctaves()</a></dt>
<dd><p>List of possible octaves for soundfonts.</p>
</dd>
<dt><a href="#generatePitchList">generatePitchList()</a></dt>
<dd><p>Generate list of notes in Scientific Pitch Notation, by octave.</p>
</dd>
<dt><a href="#instrument">instrument()</a></dt>
<dd><p>Factory wrapper for <a href="#Instrument">Instrument</a></p>
</dd>
<dt><a href="#player">player()</a></dt>
<dd><p>Factory wrapper for <a href="#Player">Player</a></p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#prepareCallback">prepareCallback</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#playCallback">playCallback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="Instrument"></a>

## Instrument
Abstract collection of related 'soundfonts'.
Frontend for Android's `SoundPool` with safety checks and convenience features.

**Kind**: global class  

* [Instrument](#Instrument)
    * [new Instrument(name, [maxStreams])](#new_Instrument_new)
    * [.prepare(notes, callback)](#Instrument+prepare)
    * [.play(notes, callback, [gain], [speed])](#Instrument+play)
    * [.stop(streams)](#Instrument+stop)
    * [.pause(streams)](#Instrument+pause)
    * [.resume(streams)](#Instrument+resume)
    * [.pauseAll()](#Instrument+pauseAll)
    * [.resumeAll()](#Instrument+resumeAll)

<a name="new_Instrument_new"></a>

### new Instrument(name, [maxStreams])

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | An instrument name (see example) |
| [maxStreams] | <code>number</code> | Number of sounds able to play simultainiously |

<a name="Instrument+prepare"></a>

### instrument.prepare(notes, callback)
Try to garentee that notes are ready for playback.

**Kind**: instance method of [<code>Instrument</code>](#Instrument)  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array.&lt;string&gt;</code> |  |
| callback | [<code>prepareCallback</code>](#prepareCallback) | called when all `notes` are prepared |

<a name="Instrument+play"></a>

### instrument.play(notes, callback, [gain], [speed])
**Kind**: instance method of [<code>Instrument</code>](#Instrument)  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array.&lt;string&gt;</code> |  |
| callback | [<code>playCallback</code>](#playCallback) | called when sounds are queued in the native layer |
| [gain] | <code>number</code> | gain/volume multiplier (0.0 - 1.0) |
| [speed] | <code>number</code> | speed multiplier (0.5 - 2.0) |

<a name="Instrument+stop"></a>

### instrument.stop(streams)
Immediately stop provided streams.

**Kind**: instance method of [<code>Instrument</code>](#Instrument)  

| Param | Type | Description |
| --- | --- | --- |
| streams | <code>Array.&lt;number&gt;</code> | see {playCallback} |

<a name="Instrument+pause"></a>

### instrument.pause(streams)
**Kind**: instance method of [<code>Instrument</code>](#Instrument)  

| Param | Type |
| --- | --- |
| streams | <code>Array.&lt;number&gt;</code> | 

<a name="Instrument+resume"></a>

### instrument.resume(streams)
**Kind**: instance method of [<code>Instrument</code>](#Instrument)  

| Param | Type |
| --- | --- |
| streams | <code>Array.&lt;number&gt;</code> | 

<a name="Instrument+pauseAll"></a>

### instrument.pauseAll()
Pause all playing sounds.

**Kind**: instance method of [<code>Instrument</code>](#Instrument)  
<a name="Instrument+resumeAll"></a>

### instrument.resumeAll()
Resume all paused sounds.

**Kind**: instance method of [<code>Instrument</code>](#Instrument)  
<a name="Player"></a>

## Player
Manages the playback notes in an instrument.

**Kind**: global class  

* [Player](#Player)
    * [new Player(instrument, options)](#new_Player_new)
    * [.prepare(notes)](#Player+prepare)
    * [.play(notes, when)](#Player+play)
    * [.stop()](#Player+stop)
    * [.pause()](#Player+pause)
    * [.resume()](#Player+resume)

<a name="new_Player_new"></a>

### new Player(instrument, options)

| Param | Type | Description |
| --- | --- | --- |
| instrument | [<code>Instrument</code>](#Instrument) \| <code>string</code> | The instrument to play from |
| options | <code>Object</code> |  |

<a name="Player+prepare"></a>

### player.prepare(notes)
Convenience promise wrapper for [Instrument](#Instrument)'s `prepare`.

**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type |
| --- | --- |
| notes | <code>Array.&lt;string&gt;</code> \| <code>string</code> | 

<a name="Player+play"></a>

### player.play(notes, when)
**Kind**: instance method of [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array.&lt;string&gt;</code> \| <code>string</code> | notes |
| when | <code>number</code> | When on timeline to play note(s); millisecond precision.   Timeline starts on first `play()`, and ends after all notes finish playing. |

<a name="Player+stop"></a>

### player.stop()
Stop all playing notes.

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+pause"></a>

### player.pause()
Pause all playing notes.

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="Player+resume"></a>

### player.resume()
Resume all paused notes.

**Kind**: instance method of [<code>Player</code>](#Player)  
<a name="getNotes"></a>

## getNotes()
List of possible notes for soundfonts.

**Kind**: global function  
<a name="getOctaves"></a>

## getOctaves()
List of possible octaves for soundfonts.

**Kind**: global function  
<a name="generatePitchList"></a>

## generatePitchList()
Generate list of notes in Scientific Pitch Notation, by octave.

**Kind**: global function  
<a name="instrument"></a>

## instrument()
Factory wrapper for [Instrument](#Instrument)

**Kind**: global function  
<a name="player"></a>

## player()
Factory wrapper for [Player](#Player)

**Kind**: global function  
<a name="prepareCallback"></a>

## prepareCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| failedNotes | <code>Array.&lt;number&gt;</code> | `null` on success, or list of notes that failed to load |

<a name="playCallback"></a>

## playCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| streams | <code>Array.&lt;number&gt;</code> | stream handles used in controlling playback, or `null` on error |

