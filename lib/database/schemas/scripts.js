const { Entity, Schema } = require('redis-om');

class Scripts extends Entity {}

module.exports = new Schema(Scripts, {
  name: { type: 'string' },
  path: { type: 'string' }
}, {
  dataStructure: 'HASH'
});