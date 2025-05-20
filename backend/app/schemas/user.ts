import { ApiProperty } from '@foadonis/openapi/decorators'

export class User {
  @ApiProperty({ required: false })
  declare id: string

  @ApiProperty()
  declare email: string

  @ApiProperty()
  declare firstName: string

  @ApiProperty()
  declare lastName: string
}
