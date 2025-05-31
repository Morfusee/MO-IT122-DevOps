import { ApiProperty } from '@foadonis/openapi/decorators'

export class MessagePrompt {
  @ApiProperty({ description: 'Prompt from the user' })
  declare prompt: string

  @ApiProperty({
    type: [String],
    required: false,
    description: 'List of attachment urls',
    example: [],
  })
  declare attachmentUrls: string[]

  @ApiProperty({ required: false, description: 'Template to use for the prompt', example: 'tutor' })
  declare template: string
}

export class MessagePair {
  @ApiProperty()
  declare id: string

  @ApiProperty()
  declare chatId: string

  @ApiProperty()
  declare prompt: string

  @ApiProperty()
  declare json_response: string

  @ApiProperty({ required: false })
  declare image: string

  @ApiProperty({ required: false })
  declare template: string

  @ApiProperty()
  declare createdAt: string

  @ApiProperty()
  declare updatedAt: string
}
