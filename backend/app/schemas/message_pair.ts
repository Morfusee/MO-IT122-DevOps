import { ApiProperty } from '@foadonis/openapi/decorators'

export class MessagePrompt {
  @ApiProperty()
  declare prompt: string

  @ApiProperty({ type: [String], required: false })
  declare attachmentUrls: string[]

  @ApiProperty({ required: false })
  declare templateId: string
}

export class Response {
  @ApiProperty({
    required: false,
    example: 'Failed to generate response',
  })
  declare text: string

  @ApiProperty({
    required: false,
    example: '',
  })
  declare image: string
}

export class MessagePair {
  @ApiProperty()
  declare id: string

  @ApiProperty()
  declare prompt: string

  @ApiProperty({ type: () => Response })
  declare response: Response

  @ApiProperty({ required: false })
  declare templateId: string

  @ApiProperty({ required: false })
  declare chatId: string
}
