const { Entity, Schema } = require('redis-om');

class Schedules extends Entity {}

module.exports = new Schema(Schedules, {
  script: { type: 'string' },
  env: { type: 'string' },
  expression: { type: 'string' }
}, {
  dataStructure: 'HASH'
});