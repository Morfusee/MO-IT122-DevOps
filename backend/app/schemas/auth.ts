import { ApiProperty } from '@foadonis/openapi/decorators'

export class AuthForm {
  @ApiProperty()
  declare email: string

  @ApiProperty()
  declare password: string
}

export class RegisterForm {
  @ApiProperty()
  declare email: string

  @ApiProperty()
  declare password: string

  @ApiProperty()
  declare firstName: string

  @ApiProperty()
  declare lastName: string
}
