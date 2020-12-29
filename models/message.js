const { Schema, model } = require('mongoose');

const messageSchema = Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

messageSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();
  return object;
})

module.exports = model('Message', messageSchema);