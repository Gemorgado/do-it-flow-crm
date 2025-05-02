
# Testing Documentation

## Running Tests

Since we cannot modify `package.json`, use the following command to run tests:

```bash
npx vitest run
```

Or for watch mode:

```bash
npx vitest
```

## Test Structure

- Unit tests: Located next to the files they test with `.test.ts` or `.test.tsx` suffix
- Integration tests: Located in `tests` folders within component directories
- Test utilities: Located in `src/test/utils.tsx`
- Test setup: Located in `src/test/setup.ts`

## Writing Tests

### Example unit test:
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFile';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Example component test:
```typescript
import { render, screen } from '@/test/utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```
