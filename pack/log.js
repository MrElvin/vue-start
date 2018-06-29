const { Signale } = require('signale')

const options = {
  disabled: false,
  interactive: false,
  stream: process.stdout,
  types: {
    error: {
      badge: '💥',
      color: 'red',
      label: 'error'
    },
    success: {
      badge: '🌈',
      color: 'green',
      label: 'success'
    },
    warn: {
      badge: '🚧',
      color: 'yellow',
      label: 'warning'
    },
    info: {
      badge: '🔖',
      color: 'white',
      label: 'info'
    }
  }
}

module.exports = new Signale(options)
