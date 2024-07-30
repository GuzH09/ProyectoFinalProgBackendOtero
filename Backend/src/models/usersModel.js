import mongoose from 'mongoose'
import { createHash } from '../utils/functionsUtil.js'

const userCollection = 'users'

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    minLength: 3,
    require: true
  },
  last_name: {
    type: String,
    minLength: 3,
    require: true
  },
  email: {
    type: String,
    minLength: 5,
    require: true,
    unique: true
  },
  age: {
    type: Number,
    min: 18,
    require: true
  },
  password: {
    type: String,
    hash: true,
    minLength: 5,
    require: true
  },
  cart: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts'
    }],
    default: []
  },
  role: {
    type: String,
    require: true,
    default: 'user'
  },
  documents: {
    type: [{
      name: {
        type: String,
        require: false
      },
      reference: {
        type: String,
        require: false
      }
    }],
    require: false,
    default: []
  },
  last_connection: {
    type: Date,
    require: false,
    default: Date.now()
  }
})

userSchema.pre('save', function () {
  this.password = createHash(this.password)
})

userSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate()

  // Check if the password is being updated
  if (update.password) {
    update.password = await createHash(update.password)
  }

  next()
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel
