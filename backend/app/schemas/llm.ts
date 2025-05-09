import { ApiProperty } from '@foadonis/openapi/decorators'

export class GeminiPromptSample {
  @ApiProperty()
  declare prompt: string
}

export class GeminiResponseSample {
  @ApiProperty()
  declare content: string
}
