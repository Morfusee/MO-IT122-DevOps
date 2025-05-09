import hash from '@adonisjs/core/services/hash'
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
  },
  {
    timestamps: true,
    methods: {
      async verifyPassword(passwordString: string) {
        return await hash.verify(this.passwordHash, passwordString)
      },
    },
  }
)

UserSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await hash.make(this.passwordHash)
  }

  next()
})

UserSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.passwordHash

    return ret
  },
})

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
