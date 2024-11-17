# Environment setup: Playwright, TypeScript, Mocha, and Chai

## Step 1: Initialize the Project
```bash
npm install
```

## Step 2: Install Required Browser Binaries
```bash
npx playwright install
```

## Step 3: Run Tests
```bash
npm run test
```

## Test Results
The test report will be available at:
```
mochawesome-report/mochawesome.html
```

# Design Consideration

1. **Toolchain Selection:**
   - *Playwright:* Chosen for its robust capabilities in browser automation and testing.
   - *TypeScript:* Selected to enhance code quality through static typing and improved readability.
   - *Mocha and Chai:* Utilized for their flexibility and expressiveness in writing and structuring tests.

2. **Project Structure:**
   - Organized into directories such as `components`, `entities`, `pages`, `tests`, and `utils` to promote modularity and ease of maintenance.
   - Test: `tests/new-service-route.spec.ts`
   - TestData: `testdata/service-route.json`
   - Page class: `pages/`

3. **Testing Framework:**
   - Mocha was integrated as the test runner, with Chai providing assertion capabilities, facilitating clear and concise test definitions.

4. **Reporting:**
   - Incorporated `mochawesome` to generate comprehensive HTML test reports, aiding in result analysis and debugging.

# CI
Github actions: https://github.com/liupengmsq/kong_automation/actions/workflows/ci.yml