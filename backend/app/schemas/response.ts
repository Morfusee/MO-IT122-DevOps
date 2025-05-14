import { ApiProperty } from '@foadonis/openapi/decorators'

/**
 * The Success class represents a standard structure for success responses.
 * It contains a message to describe the successful operation or result.
 *
 * @class
 */
export class Success {
  @ApiProperty()
  declare message: string
}

/**
 * This class represents an Error structure commonly used for error handling.
 * It contains properties that define the status code, message, and
 * additional error details.
 *
 * Properties:
 * - status: The HTTP status code associated with the error.
 * - message: A descriptive message providing more context about the error.
 * - error: A string representing the specific error encountered.
 */
export class Error {
  @ApiProperty()
  declare status: number

  @ApiProperty()
  declare message: string

  @ApiProperty()
  declare error: string
}

/**
 * Represents a class that holds authentication tokens.
 *
 * The AuthTokens class is used to structure and represent token-based authentication data.
 * It contains properties related to the authentication tokens, primarily an access token.
 *
 * This class can serve as a data structure for managing or transferring authentication
 * tokens in applications requiring secure user verification processes.
 */
export class AuthTokens {
  @ApiProperty()
  declare accessToken: string
}
