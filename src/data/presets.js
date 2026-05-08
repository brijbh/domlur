export const presets = [
  {
    id: 'clean',
    name: 'Clean',
    settings: {
      density: 'balanced',
      sizeMix: 'balanced',
      orientation: 'horizontal',
      composition: 'balanced',
      repeatMode: 'full',
      fillStyle: 'soft',
    },
  },
  {
    id: 'poster',
    name: 'Poster',
    settings: {
      density: 'dense',
      sizeMix: 'poster',
      orientation: 'all',
      composition: 'burst',
      repeatMode: 'full',
      fillStyle: 'bleed',
    },
  },
  {
    id: 'textile',
    name: 'Textile',
    settings: {
      density: 'max',
      sizeMix: 'even',
      orientation: 'diagonal',
      composition: 'edge',
      repeatMode: 'words',
      fillStyle: 'edge',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    settings: {
      density: 'sparse',
      sizeMix: 'even',
      orientation: 'horizontal',
      composition: 'balanced',
      repeatMode: 'full',
      fillStyle: 'soft',
    },
  },
  {
    id: 'chaos',
    name: 'Chaos',
    settings: {
      density: 'max',
      sizeMix: 'poster',
      orientation: 'all',
      composition: 'asymmetric',
      repeatMode: 'letters',
      fillStyle: 'bleed',
    },
  },
]
