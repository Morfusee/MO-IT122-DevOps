import { ApiProperty } from "@foadonis/openapi/decorators";
import mongoose from "mongoose";


export class User {
  @ApiProperty({ required: false })
  declare id: string

  @ApiProperty({required: true})
  declare email: string
}

const UserSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
})

UserSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    return ret
  }
})

const UserModel = mongoose.model("User", UserSchema)


export default UserModel