# API overview

Base URL: `http://localhost:3001/api/v1`

## Errors

Every error has the same shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The school profile is invalid.",
    "fields": { "schoolEmail": "Use an email ending in @nushigh.edu.sg." }
  }
}
```

Next: [Bookings](bookings.md)

[Back to contents](../README.md)
