# Cyber/Error
> Intuitive error handling with native support for rethrows and custom flags along with an extendable dictionary of common errors

Member of: [**CyberTools**](https://www.npmjs.com/package/cyber-tools)

## Introduction
Custom error handling with native support for rethrows and specific flags affecting consequent behavior of the framework along with an extendable dictionary of common errors helps cover any scenarios, expected or unexpected.

Comes with an extendable dictionary of default errors for common use cases: [**Error Dictionary**](/error/lib/errors.js)

Examples:
- `Robot.errors.Network` - throw, print and report a generic network error
- `Robot.errors.access.Blocked` - throw, print and report a generic access error
- `Robot.errors.session.Rotate` - rotate proxy session before retrying a failed action
- `Robot.errors.Status({error, retry: true, retireSession: true, statusCode: 403})` - rethrow previous error as cause of the custom error, retire proxy session before retrying failed action and print a message with failed status code before reporting the error to external monitoring channel