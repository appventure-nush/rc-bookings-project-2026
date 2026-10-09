# Bookings

## Create a booking

`POST /api/v1/bookings` · **Access:** student

Creates a `draft` booking. Nobody is notified until the student submits it.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `congressId` | string | yes | The congress to book. |
| `teacherId` | string | yes | Teacher who will review it. |
| `sessionIds` | string[] | yes | One or more session IDs. |
| `studentMessage` | string | no | Note to the teacher. |

**cURL**

```bash
curl -X POST http://localhost:3001/api/v1/bookings \
  -b cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"congressId": "f169df32-…", "teacherId": "user-teacher-1", "sessionIds": ["96103100-…"]}'
```

**JavaScript**

```js
const res = await fetch(`${API}/bookings`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ congressId, teacherId, sessionIds }),
})
```

**Errors:** `SESSION_FULL` (400), `BOOKING_ALREADY_EXISTS` (409)

[Back to contents](../README.md)
