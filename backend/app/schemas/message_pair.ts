import { ApiProperty } from '@foadonis/openapi/decorators'

export class MessagePrompt {
  @ApiProperty()
  declare prompt: string

  @ApiProperty({ type: [String], required: false })
  declare attachmentUrls: string[]

  @ApiProperty({ required: false })
  declare template: string
}

export class MessagePair {
  @ApiProperty()
  declare id: string

  @ApiProperty()
  declare prompt: string

  @ApiProperty()
  declare json_response: JSON

  @ApiProperty()
  declare image: string

  @ApiProperty()
  declare image_description: string

  @ApiProperty({ required: false })
  declare template: string

  @ApiProperty()
  declare chatId: string
}
