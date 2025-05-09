import { ApiProperty } from '@foadonis/openapi/decorators'

export class AuthForm {
  @ApiProperty()
  declare email: string

  @ApiProperty()
  declare password: string
}
