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
}

export class NewChat {
  @ApiProperty()
  declare chat: Chat

  @ApiProperty()
  declare messagePair: MessagePair
}
