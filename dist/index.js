
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./mrkv-diary.cjs.production.min.js')
} else {
  module.exports = require('./mrkv-diary.cjs.development.js')
}
