import { ApiProperty } from '@foadonis/openapi/decorators'

export class AuthForm {
  @ApiProperty()
  declare email: string

  @ApiProperty()
  declare password: string

  @ApiProperty()
  declare firstName: string

  @ApiProperty()
  declare lastName: string
}
