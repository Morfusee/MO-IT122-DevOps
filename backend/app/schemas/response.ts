import { ApiProperty } from '@foadonis/openapi/decorators'

export class Success {
  @ApiProperty()
  declare message: string
}

export class Error {
  @ApiProperty()
  declare status: number

  @ApiProperty()
  declare message: string

  @ApiProperty()
  declare error: string
}

export class AuthTokens {
  @ApiProperty()
  declare accessToken: string
}
