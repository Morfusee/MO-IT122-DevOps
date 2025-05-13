import { ApiProperty } from '@foadonis/openapi/decorators'

export class Chat {
  @ApiProperty({ required: false })
  declare id: string

  @ApiProperty()
  declare title: String

  @ApiProperty()
  declare topic: string
}

export class ChatRequest {
  @ApiProperty()
  declare prompt: string
}
