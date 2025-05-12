import { ApiProperty } from '@foadonis/openapi/decorators'

export class Chat {
  @ApiProperty({ required: false })
  declare id: string

  @ApiProperty()
  declare userId: string

  @ApiProperty()
  declare name: String

  @ApiProperty()
  declare topic: string

  @ApiProperty()
  declare createdAt: string

  @ApiProperty()
  declare updatedAt: string
}
