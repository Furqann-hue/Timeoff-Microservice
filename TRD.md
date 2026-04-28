# Technical Requirement Document (TRD)
## Time-Off Microservice (ReadyOn)

---

# 1. Overview

ReadyOn provides an employee-facing system for managing time-off requests. However, the Human Capital Management (HCM) system (e.g., Workday, SAP) remains the **source of truth** for all employment and leave balance data.

This microservice acts as a **coordination and enforcement layer** between ReadyOn and HCM to ensure:
- Accurate balance tracking
- Safe request validation
- Synchronization of external updates

---

# 2. Problem Statement

Maintaining consistent leave balances between ReadyOn and HCM is difficult because:

- HCM may update balances independently (annual refresh, bonuses, corrections)
- ReadyOn may process requests concurrently
- HCM responses may be delayed, missing, or inconsistent
- Multiple systems can modify the same employee balance

This leads to potential:
- Over-allocation of leave
- Stale balance views
- Invalid approvals

---

# 3. Goals

- Maintain accurate per-employee, per-location leave balances
- Support time-off request lifecycle (create → validate → approve/reject)
- Sync balances from HCM (batch updates)
- Handle missing or unreliable HCM responses defensively

---

# 4. System Design

## Components

### 1. Time-Off Microservice (This system)
Responsible for:
- Request handling
- Balance tracking (cached state)
- Validation logic
- Sync processing

### 2. HCM System (External / Mocked)
Provides:
- Batch balance updates
- Real-time validation API
- Source-of-truth data

---

# 5. Data Model

## Balance
- employeeId (string)
- locationId (string)
- balance (number)

## Request
- id
- employeeId
- locationId
- daysRequested
- status (APPROVED | REJECTED)

---

# 6. API Design

## 6.1 Get Balance
GET /balances/:employeeId/:locationId

Returns current cached balance.

---

## 6.2 Create Time-Off Request
POST /requests

### Flow:
1. Check local balance
2. Validate availability
3. Call HCM mock validation
4. Approve or reject request
5. Deduct balance if approved

---

## 6.3 Batch Sync (HCM → ReadyOn)
POST /sync/batch

Used to update all employee balances from HCM system.

---

## 6.4 HCM Validation (Mock)
POST /hcm/validate

Simulates external system validation.

---

# 7. Key Challenges & Solutions

## 7.1 Source of Truth Conflict
- HCM is authoritative system
- ReadyOn maintains cached state for performance

Solution:
- Batch sync reconciles state periodically

---

## 7.2 Missing or unreliable HCM responses
Problem:
HCM may fail or not respond consistently.

Solution:
- Local validation is primary guard
- Defensive fallback logic ensures system does not over-approve

---

## 7.3 Concurrency risk
Problem:
Multiple requests may consume same balance.

Solution (MVP):
- Sequential in-memory processing

Future:
- Distributed locking (Redis)

---

## 7.4 Data drift
Problem:
HCM updates independently (anniversary, corrections)

Solution:
- Batch sync overwrites local state

---

# 8. Tradeoffs

## In-memory storage
✔ fast  
❌ not persistent  

## No external DB (SQLite not used in MVP)
✔ simple  
❌ not production ready  

## Mock HCM
✔ testable  
❌ not real integration  

---

# 9. Future Improvements

- Replace memory store with SQLite/PostgreSQL
- Add retry + queue system for HCM sync
- Add audit logs for all requests
- Add idempotency keys for safe retries
- Add distributed locking for concurrency safety

---

# 10. Conclusion

This implementation focuses on correctness of business logic, API design, and system consistency under a simplified architecture, while simulating real-world HCM synchronization challenges.