# Anti-Pattern Detection Guide

Understanding code anti-patterns, their detection, and remediation strategies.

## Table of Contents

- [What Are Anti-Patterns?](#what-are-anti-patterns)
- [Detection Rules](#detection-rules)
- [Severity Levels](#severity-levels)
- [Catalog of Anti-Patterns](#catalog-of-anti-patterns)
- [Using the Detector](#using-the-detector)
- [Interpreting Results](#interpreting-results)
- [Remediation Strategies](#remediation-strategies)

## What Are Anti-Patterns?

Anti-patterns are common responses to recurring problems that are usually ineffective and risk counterproductive. In software development, anti-patterns are poor solutions to design and implementation problems that:

- **Reduce Code Quality**: Make code harder to understand and maintain
- **Increase Technical Debt**: Create problems that compound over time
- **Harm Performance**: May cause inefficiencies or bugs
- **Violate Principles**: Break SOLID, DRY, and other best practices

### Why Detect Anti-Patterns?

1. **Prevent Technical Debt**: Catch issues before they become problems
2. **Improve Maintainability**: Keep code clean and understandable
3. **Enhance Collaboration**: Make code easier for teams to work on
4. **Reduce Bugs**: Many anti-patterns lead to defects
5. **Boost Performance**: Some anti-patterns impact efficiency

## Detection Rules

The SonarQube MCP Server includes custom anti-pattern detection rules beyond standard SonarQube analysis.

### Rule Configuration

Rules are defined in `mcp-server/src/config/rules.ts`:

```typescript
export const CustomRules = {
  antiPatterns: [
    { id: "god-object", severity: "CRITICAL", ... },
    { id: "long-method", severity: "HIGH", ... },
    { id: "magic-number", severity: "MEDIUM", ... },
    // ... more rules
  ]
};
```

### Thresholds

Default thresholds (customizable):

| Anti-Pattern | Threshold | Configurable |
|--------------|-----------|--------------|
| God Object | 20 methods / 500 lines | ✅ |
| Long Method | 50 lines | ✅ |
| Magic Numbers | Numeric literals > 1 | ✅ |
| Duplicate Code | 6+ lines duplicated | ✅ |
| Complex Conditionals | 3+ logical operators | ✅ |
| Long Parameter List | 5+ parameters | ✅ |
| Deep Nesting | 4+ indentation levels | ✅ |

## Severity Levels

### CRITICAL 🔴

**Impact**: Fundamental architectural problems that require immediate attention.

**Examples**:
- God Objects (classes with 20+ methods or 500+ lines)
- Severe violations of Single Responsibility Principle

**Action Required**: Refactor as soon as possible

---

### HIGH 🟠

**Impact**: Significant code quality issues that increase maintenance burden.

**Examples**:
- Long Methods (50+ lines)
- Duplicate Code (6+ lines repeated)
- Large Files (500+ lines)

**Action Required**: Plan refactoring in next sprint

---

### MEDIUM 🟡

**Impact**: Code smells that reduce readability and maintainability.

**Examples**:
- Magic Numbers (unexplained literals)
- Complex Conditionals (3+ operators)
- Long Parameter Lists (5+ params)
- Deep Nesting (4+ levels)
- Potential Circular Dependencies

**Action Required**: Address during regular refactoring

---

### LOW 🟢

**Impact**: Minor issues or best practice violations.

**Examples**:
- Small code smells
- Style inconsistencies
- Missing documentation

**Action Required**: Fix when touching related code

## Catalog of Anti-Patterns

### 1. God Object (CRITICAL)

**Description**: A class that knows too much or does too much.

**Detection Criteria**:
- Class with 20+ methods
- File with 500+ lines
- Class handling multiple responsibilities

**Example**:
```typescript
// ❌ BAD: God Object
class UserManager {
  // User authentication (20 methods)
  login() { }
  logout() { }
  resetPassword() { }
  // ... 17 more auth methods
  
  // User data management (15 methods)
  create() { }
  update() { }
  delete() { }
  // ... 12 more CRUD methods
  
  // User notifications (10 methods)
  sendEmail() { }
  sendSMS() { }
  // ... 8 more notification methods
  
  // Analytics (8 methods)
  trackLogin() { }
  generateReport() { }
  // ... 6 more analytics methods
}
```

**Refactoring**:
```typescript
// ✅ GOOD: Split responsibilities
class UserAuthenticationService {
  login() { }
  logout() { }
  resetPassword() { }
}

class UserDataService {
  create() { }
  update() { }
  delete() { }
}

class UserNotificationService {
  sendEmail() { }
  sendSMS() { }
}

class UserAnalyticsService {
  trackLogin() { }
  generateReport() { }
}
```

**Recommendation**: Apply Single Responsibility Principle. Extract cohesive groups of methods into separate classes.

---

### 2. Long Method (HIGH)

**Description**: A method that is too long to understand quickly.

**Detection Criteria**:
- Method with 50+ lines
- Multiple responsibilities in one method
- Deep nesting levels

**Example**:
```typescript
// ❌ BAD: 80-line method
async function processOrder(order) {
  // Validation (15 lines)
  if (!order) throw new Error('Invalid order');
  if (!order.items) throw new Error('No items');
  // ... more validation
  
  // Calculate totals (20 lines)
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
    // ... complex calculations
  }
  
  // Apply discounts (15 lines)
  let discount = 0;
  if (order.coupon) {
    discount = calculateDiscount(order.coupon);
    // ... more discount logic
  }
  
  // Process payment (20 lines)
  const payment = await processPayment({
    amount: subtotal - discount,
    // ... payment details
  });
  
  // Send notifications (10 lines)
  await sendOrderConfirmation(order);
  await notifyWarehouse(order);
  // ... more notifications
}
```

**Refactoring**:
```typescript
// ✅ GOOD: Extract methods
async function processOrder(order) {
  validateOrder(order);
  const totals = calculateOrderTotals(order);
  const payment = await processOrderPayment(totals);
  await sendOrderNotifications(order, payment);
  return { order, payment };
}

function validateOrder(order) { /* 10 lines */ }
function calculateOrderTotals(order) { /* 15 lines */ }
async function processOrderPayment(totals) { /* 15 lines */ }
async function sendOrderNotifications(order, payment) { /* 10 lines */ }
```

**Recommendation**: Extract Method refactoring. Each method should do one thing well.

---

### 3. Magic Number (MEDIUM)

**Description**: Unexplained numeric literals that reduce code readability.

**Detection Criteria**:
- Numeric literals except 0, 1, -1, 100, 1000
- No constant definition
- No explanatory comment

**Example**:
```typescript
// ❌ BAD: Magic numbers
function calculateTimeout(attempts) {
  return Math.min(1000 * Math.pow(2, attempts), 20000);
}

function checkLimit(value) {
  return value <= 65536;
}

function paginate(items) {
  const perPage = 25;
  // ...
}
```

**Refactoring**:
```typescript
// ✅ GOOD: Named constants
const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 20000;
const MAX_ISSUE_BODY_SIZE = 65536; // GitHub API limit
const DEFAULT_PAGE_SIZE = 25;

function calculateTimeout(attempts) {
  const exponentialDelay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempts);
  return Math.min(exponentialDelay, MAX_RETRY_DELAY_MS);
}

function checkLimit(value) {
  return value <= MAX_ISSUE_BODY_SIZE;
}

function paginate(items) {
  const perPage = DEFAULT_PAGE_SIZE;
  // ...
}
```

**Recommendation**: Extract to named constants with descriptive names and comments explaining significance.

---

### 4. Duplicate Code (HIGH)

**Description**: Identical or very similar code in multiple places.

**Detection Criteria**:
- 6+ lines of code duplicated
- Similar code patterns repeated
- Copy-pasted logic

**Example**:
```typescript
// ❌ BAD: Duplicate code
function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  const connection = await getConnection();
  try {
    const result = await connection.query(query, [email]);
    return result[0];
  } finally {
    await connection.release();
  }
}

function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const connection = await getConnection();
  try {
    const result = await connection.query(query, [id]);
    return result[0];
  } finally {
    await connection.release();
  }
}
```

**Refactoring**:
```typescript
// ✅ GOOD: Extract common logic
async function executeQuery(query, params) {
  const connection = await getConnection();
  try {
    const result = await connection.query(query, params);
    return result[0];
  } finally {
    await connection.release();
  }
}

function getUserByEmail(email) {
  return executeQuery('SELECT * FROM users WHERE email = ?', [email]);
}

function getUserById(id) {
  return executeQuery('SELECT * FROM users WHERE id = ?', [id]);
}
```

**Recommendation**: Apply DRY (Don't Repeat Yourself). Extract common logic into reusable functions.

---

### 5. Complex Conditional (MEDIUM)

**Description**: Conditional statements with too many logical operators.

**Detection Criteria**:
- 3+ logical operators (&&, ||) in one condition
- Nested conditions
- Hard to understand logic

**Example**:
```typescript
// ❌ BAD: Complex conditional
if (user && user.isActive && user.role === 'admin' && 
    (user.permissions.includes('write') || user.permissions.includes('delete')) &&
    !user.isLocked && user.emailVerified) {
  // do something
}
```

**Refactoring**:
```typescript
// ✅ GOOD: Extract to named functions
function isActiveAdmin(user) {
  return user && user.isActive && user.role === 'admin';
}

function hasModifyPermissions(user) {
  return user.permissions.includes('write') || 
         user.permissions.includes('delete');
}

function canAccessResource(user) {
  return !user.isLocked && user.emailVerified;
}

if (isActiveAdmin(user) && hasModifyPermissions(user) && canAccessResource(user)) {
  // do something
}
```

**Recommendation**: Extract conditions into well-named boolean methods or variables.

---

### 6. Long Parameter List (MEDIUM)

**Description**: Functions with too many parameters.

**Detection Criteria**:
- 5+ parameters
- Multiple optional parameters
- Hard to remember parameter order

**Example**:
```typescript
// ❌ BAD: Too many parameters
function createUser(
  name: string,
  email: string,
  password: string,
  role: string,
  department: string,
  manager: string,
  startDate: Date
) {
  // ...
}

// Calling code is error-prone
createUser('John', 'john@example.com', 'pass123', 'developer', 'Engineering', 'Jane', new Date());
```

**Refactoring**:
```typescript
// ✅ GOOD: Parameter object
interface CreateUserOptions {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  manager: string;
  startDate: Date;
}

function createUser(options: CreateUserOptions) {
  // ...
}

// Calling code is clear
createUser({
  name: 'John',
  email: 'john@example.com',
  password: 'pass123',
  role: 'developer',
  department: 'Engineering',
  manager: 'Jane',
  startDate: new Date()
});
```

**Recommendation**: Use parameter objects or builder pattern.

---

### 7. Deep Nesting (MEDIUM)

**Description**: Code with excessive indentation levels.

**Detection Criteria**:
- 4+ indentation levels
- Multiple nested loops/conditionals
- Hard to follow logic flow

**Example**:
```typescript
// ❌ BAD: Deep nesting
function processData(items) {
  if (items) {
    if (items.length > 0) {
      for (const item of items) {
        if (item.isValid) {
          if (item.type === 'special') {
            if (item.hasChildren) {
              for (const child of item.children) {
                // deeply nested logic
              }
            }
          }
        }
      }
    }
  }
}
```

**Refactoring**:
```typescript
// ✅ GOOD: Guard clauses and extracted methods
function processData(items) {
  if (!items || items.length === 0) return;
  
  items
    .filter(item => item.isValid)
    .forEach(item => processItem(item));
}

function processItem(item) {
  if (item.type !== 'special') return;
  if (!item.hasChildren) return;
  
  item.children.forEach(child => processChild(child));
}

function processChild(child) {
  // processing logic
}
```

**Recommendation**: Use guard clauses, extract methods, and prefer early returns.

---

### 8. Circular Dependency (MEDIUM)

**Description**: Modules that depend on each other, creating a cycle.

**Detection Criteria**:
- Module A imports Module B
- Module B imports Module A (directly or indirectly)
- Import from parent directories

**Example**:
```typescript
// ❌ BAD: Circular dependency
// file: services/user-service.ts
import { OrderService } from './order-service';

class UserService {
  getOrders(userId) {
    return OrderService.getByUser(userId);
  }
}

// file: services/order-service.ts
import { UserService } from './user-service';

class OrderService {
  getUser(orderId) {
    return UserService.getById(orderId.userId);
  }
}
```

**Refactoring**:
```typescript
// ✅ GOOD: Dependency injection or shared interface
// file: services/user-service.ts
class UserService {
  constructor(private orderRepository) {}
  
  getOrders(userId) {
    return this.orderRepository.findByUser(userId);
  }
}

// file: services/order-service.ts
class OrderService {
  constructor(private userRepository) {}
  
  getUser(orderId) {
    return this.userRepository.findById(orderId.userId);
  }
}

// file: repositories/user-repository.ts
class UserRepository {
  findById(id) { /* ... */ }
}

// file: repositories/order-repository.ts
class OrderRepository {
  findByUser(userId) { /* ... */ }
}
```

**Recommendation**: Use dependency injection, extract shared interfaces, or restructure modules.

## Using the Detector

### Command Line

```bash
# Analyze single file
node mcp-server/dist/index.js <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "detect_anti_patterns",
    "arguments": {
      "filePath": "/path/to/file.ts"
    }
  }
}
EOF
```

### With AI Assistant

```
# In Claude, Cursor, or VS Code Copilot:
Use the detect_anti_patterns tool to analyze src/manifest.ts

# Or more specific:
Check this file for god objects and long methods
```

### Programmatically

```typescript
import { AntiPatternDetector } from './anti-pattern-detector';

const detector = new AntiPatternDetector();
const patterns = await detector.analyze('/path/to/file.ts');

patterns.forEach(pattern => {
  console.log(`${pattern.severity}: ${pattern.name}`);
  console.log(`  Location: ${pattern.location.file}:${pattern.location.line}`);
  console.log(`  ${pattern.description}`);
  console.log(`  Recommendation: ${pattern.recommendation}`);
});
```

## Interpreting Results

### Example Output

```markdown
# Anti-Patterns Detected: 15

## CRITICAL Severity (2)

### God Object
**Location:** src/manifest.ts:1
**Description:** Class has 23 methods (threshold: 20). This violates Single Responsibility Principle.
**Recommendation:** Apply Single Responsibility Principle. Extract related methods into separate classes or modules.

### God Object / Large File
**Location:** src/github.ts:1
**Description:** File has 1799 lines (threshold: 500). File is too large and complex.
**Recommendation:** Break down into smaller, focused modules.

## HIGH Severity (5)

### Long Method
**Location:** src/manifest.ts:524
**Description:** Method 'buildPullRequests' has 291 lines (threshold: 50).
**Recommendation:** Extract smaller methods with single responsibilities.

...
```

### What Each Field Means

- **Severity**: Priority level (CRITICAL, HIGH, MEDIUM, LOW)
- **Location**: File path and line number where issue starts
- **Description**: What the problem is and why it matters
- **Recommendation**: Specific steps to fix the issue

### Prioritizing Fixes

1. **Fix CRITICAL first**: Architectural issues that affect entire codebase
2. **Address HIGH next**: Significant quality issues in active development
3. **Plan for MEDIUM**: Include in regular refactoring cycles
4. **Track LOW**: Fix when touching related code

## Remediation Strategies

### General Approach

1. **Understand the Pattern**: Read the description and understand why it's problematic
2. **Plan the Refactoring**: Don't rush - plan how to restructure
3. **Write Tests First**: Ensure you have tests before refactoring
4. **Refactor Incrementally**: Small steps, commit often
5. **Verify Behavior**: Run tests after each change
6. **Update Documentation**: Keep docs in sync with code

### Common Refactoring Patterns

#### Extract Method
```typescript
// Before: Long method
function process() {
  // 100 lines of code
}

// After: Extracted methods
function process() {
  validate();
  transform();
  save();
}
```

#### Extract Class
```typescript
// Before: God object
class Manager {
  // 50 methods
}

// After: Specialized classes
class DataManager { }
class ValidationManager { }
class NotificationManager { }
```

#### Introduce Parameter Object
```typescript
// Before: Long parameter list
function create(a, b, c, d, e, f) { }

// After: Parameter object
function create(options: CreateOptions) { }
```

#### Replace Magic Number with Constant
```typescript
// Before: Magic number
if (count > 65536) { }

// After: Named constant
const MAX_SIZE = 65536;
if (count > MAX_SIZE) { }
```

### Tools to Help

- **IDE Refactoring**: Use built-in refactoring tools
- **Static Analysis**: Run linters and type checkers
- **Tests**: Comprehensive test suite
- **Code Review**: Get peer feedback
- **Continuous Integration**: Automated checks

## Configuration

### Customize Thresholds

Edit `mcp-server/src/config/rules.ts`:

```typescript
export const CustomRules = {
  antiPatterns: [
    {
      id: "god-object",
      name: "God Object Detection",
      severity: "CRITICAL",
      thresholds: {
        maxMethods: 25,  // Changed from 20
        maxLines: 600,   // Changed from 500
      },
    },
    // ... other rules
  ]
};
```

### Add Custom Rules

```typescript
{
  id: "my-custom-rule",
  name: "My Custom Anti-Pattern",
  description: "Detects specific pattern in my codebase",
  severity: "HIGH",
  thresholds: {
    // your thresholds
  },
}
```

Then implement detection in `anti-pattern-detector.ts`.

## Best Practices

1. **Run Regularly**: Check for anti-patterns on every commit
2. **Set Quality Gates**: Don't merge code with CRITICAL anti-patterns
3. **Track Metrics**: Monitor anti-pattern trends over time
4. **Educate Team**: Share knowledge about anti-patterns
5. **Refactor Continuously**: Don't let technical debt accumulate
6. **Balance Pragmatism**: Not every detection needs immediate fixing

## Further Reading

- **Martin Fowler's Refactoring**: Classic refactoring catalog
- **Clean Code by Robert C. Martin**: Principles and practices
- **Design Patterns**: Solutions to common problems
- **SOLID Principles**: Object-oriented design principles
- **Code Smells**: https://refactoring.guru/refactoring/smells

## Support

For questions about anti-patterns:
- See examples in: [docs/code-quality/anti-patterns-report.md](code-quality/anti-patterns-report.md)
- Read API docs: [API.md](API.md)
- Get help: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
