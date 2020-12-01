const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true,
    unique: true,
    maxlength: 50
  },
  blocked: {
    type: Boolean,
    default: false
  },
  block_type: {
    type: String,
    default: ''
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('users', userSchema);
