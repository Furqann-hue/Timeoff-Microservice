# Time-Off Microservice

## Overview

This project implements a Time-Off Microservice that manages employee leave requests while staying synchronized with an external Human Capital Management (HCM) system.

The system ensures:
- Accurate leave balance tracking
- Safe time-off request processing
- Batch synchronization with HCM
- Defensive handling of external system inconsistencies

---

## Tech Stack

- Node.js
- Express.js
- Jest (testing)
- Supertest (API testing)
- In-memory data store

---

## Features

- Employee time-off request lifecycle
- Balance validation before approval
- Automatic balance deduction on approval
- Batch synchronization from HCM system
- Mock HCM validation endpoint
- Defensive error handling for missing/invalid external responses

---

## API Endpoints

### Get Balance
```
GET /balances/:employeeId/:locationId
```

---

### Create Time-Off Request
```
POST /requests
```

Body:
```json
{
  "employeeId": "1",
  "locationId": "A",
  "daysRequested": 2
}
```

---

### Batch Sync from HCM
```
POST /sync/batch
```

Body:
```json
[
  {
    "employeeId": "1",
    "locationId": "A",
    "balance": 10
  }
]
```

---

### Mock HCM Validation
```
POST /hcm/validate
```

---

## How to Run

### Install dependencies
```
npm install
```

### Start server
```
node src/main.js
```

Server runs at:
```
http://localhost:3000
```

---

## Run Tests

```
npm test
```

All tests include:
- Balance sync validation
- Request lifecycle validation
- Edge case handling (insufficient balance)

---

## Project Structure

```
├── src/
│   ├── main.js
│   ├── balance.js
│   ├── request.js
│   ├── hcm.mock.js
├── test/
│   ├── timeoff.test.js
├── TRD.md
├── README.md
├── package.json
```

---

## Limitations

- Uses in-memory storage (no persistence)
- No real HCM integration (mock only)
- No distributed locking for concurrency
- No database layer (SQLite not implemented in MVP)

---

## Future Improvements

- Add SQLite or PostgreSQL persistence
- Add retry mechanism for HCM failures
- Add queue-based sync system
- Add audit logging
- Improve concurrency handling

---

## Author Notes

This project focuses on correctness of business logic, system consistency, and safe synchronization between internal and external HR systems.
