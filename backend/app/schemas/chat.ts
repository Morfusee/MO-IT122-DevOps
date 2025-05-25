import { ApiProperty } from '@foadonis/openapi/decorators'
import { MessagePair } from './message_pair.js'

export class Chat {
  @ApiProperty({ required: false })
  declare id: string

  @ApiProperty()
  declare userId: string

  @ApiProperty()
  declare name: string

  @ApiProperty()
  declare topic: string

  @ApiProperty()
  declare createdAt: string

  @ApiProperty()
  declare updatedAt: string
}

export class NewChat {
  @ApiProperty()
  declare chat: Chat

  @ApiProperty()
  declare messagePair: MessagePair
}

export class EditChat {
  @ApiProperty()
  declare name: string
}

export class DeleteChat {
  @ApiProperty()
  declare message: string
}
