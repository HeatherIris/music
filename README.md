# Vanilla JavaScript Music Player

A lightweight music player built with vanilla JavaScript and HTML5 Audio.

Originally created as a frontend practice project and later refined with improved playback state management, track preloading, pointer-based seeking, responsive interaction, and a redesigned interface.

## Live Demo

https://heatheriris.github.io/music/

## Features

- Play and pause audio
- Previous and next track navigation
- Playlist selection
- Mouse, pointer, and touch seeking
- Current time and duration display
- Next-track preloading for faster switching
- Responsive desktop and mobile interface
- Dynamic album artwork and background
- Local JSON-based track metadata

## Tech Stack

- HTML5
- CSS / Less
- Vanilla JavaScript
- Zepto
- HTML5 Audio API
- Gulp
- GitHub Pages

## Project Structure

`src/` holds the source JavaScript, HTML, and Less for the player. `dist/` is the deployable static build served locally and on GitHub Pages.

`dist/mock/data.json` stores local track metadata such as titles, artists, and asset paths. `dist/source/` contains album artwork and the demo audio files.

## Improvements

The original version was later improved with:

- fixed playback-state synchronization
- removal of runaway requestAnimationFrame loops
- improved play/pause responsiveness
- next-track preloading
- desktop pointer seeking
- larger interaction targets
- responsive card-based interface
- GitHub Pages deployment compatibility

## Running Locally

Use:

```bash
python3 -m http.server 8091 --directory dist
```

Then open:

http://127.0.0.1:8091/

## Notes

- This is a frontend-only demo.
- No backend or database is required.
- Track metadata is stored locally in JSON.
- Audio files are included only for demonstration purposes.
