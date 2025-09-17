# Tasks: Google Analytics Integration

**Input**: Design documents from `/specs/001-i-want-to/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: React 18 + TypeScript + Vite 7.1.2, gtag library
   → Structure: Single project (existing React architecture)
2. Load optional design documents:
   → data-model.md: 3 entities (AnalyticsConfig, AnalyticsEvent, ConsentState)
   → contracts/: 2 files (analytics-service.ts, component-integration.ts)
   → research.md: Direct gtag implementation, GDPR compliance
3. Generate tasks by category:
   → Setup: dependencies, environment, linting
   → Tests: contract tests, integration tests
   → Core: types, service, components
   → Integration: App.tsx integration, consent banner
   → Polish: error handling, performance validation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, existing Virtual Studio React architecture
- Paths assume repository root at `/home/ian/code/virtual-studio/`

## Phase 3.1: Setup

- [ ] T001 Install @types/gtag dependency for TypeScript support
- [ ] T002 [P] Configure environment variable validation in vite.config.ts
- [ ] T003 [P] Add gtag script to public/index.html with async loading

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T004 [P] Contract test AnalyticsService.initialize() in src/services/__tests__/analytics.test.ts
- [ ] T005 [P] Contract test AnalyticsService.trackPageView() in src/services/__tests__/analytics.test.ts
- [ ] T006 [P] Contract test AnalyticsService.updateConsent() in src/services/__tests__/analytics.test.ts
- [ ] T007 [P] Contract test ConsentState validation in src/types/__tests__/analytics.test.ts
- [ ] T008 [P] Integration test consent flow in src/components/__tests__/ConsentBanner.test.tsx
- [ ] T009 [P] Integration test page tracking in src/hooks/__tests__/useAnalytics.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T010 [P] Analytics types in src/types/analytics.ts (AnalyticsConfig, AnalyticsEvent, ConsentState)
- [ ] T011 [P] Analytics error classes in src/types/analytics.ts (AnalyticsError, ConsentRequiredError, InvalidConfigError)
- [ ] T012 Analytics service implementation in src/services/analytics.ts
- [ ] T013 ConsentBanner component in src/components/ConsentBanner.tsx
- [ ] T014 ConsentBanner styles in src/components/ConsentBanner.module.css
- [ ] T015 useAnalytics hook in src/hooks/useAnalytics.ts
- [ ] T016 AnalyticsProvider context in src/providers/AnalyticsProvider.tsx

## Phase 3.4: Integration

- [ ] T017 Integrate AnalyticsProvider in src/App.tsx
- [ ] T018 Add environment variable reading logic in src/App.tsx
- [ ] T019 Add ConsentBanner to main layout in src/App.tsx
- [ ] T020 Implement page view tracking on route changes in src/App.tsx

## Phase 3.5: Polish

- [ ] T021 [P] Add error boundary for analytics in src/components/AnalyticsErrorBoundary.tsx
- [ ] T022 [P] Add console warnings for missing environment variables in src/services/analytics.ts
- [ ] T023 [P] Validate performance impact (ensure 60fps maintained) using browser DevTools
- [ ] T024 [P] Update CLAUDE.md with final implementation notes
- [ ] T025 Run quickstart validation scenarios from specs/001-i-want-to/quickstart.md

## Dependencies

- Setup (T001-T003) before tests (T004-T009)
- Tests (T004-T009) before implementation (T010-T020)
- T010-T011 before T012 (types before service)
- T012 before T015-T016 (service before hooks/providers)
- T013-T014 completed before T019 (banner before integration)
- T015-T016 before T017 (hooks/providers before App integration)
- Implementation (T010-T020) before polish (T021-T025)

## Parallel Example

```bash
# Launch T004-T009 together (all test files):
Task: "Contract test AnalyticsService.initialize() in src/services/__tests__/analytics.test.ts"
Task: "Contract test ConsentState validation in src/types/__tests__/analytics.test.ts"  
Task: "Integration test consent flow in src/components/__tests__/ConsentBanner.test.tsx"
Task: "Integration test page tracking in src/hooks/__tests__/useAnalytics.test.ts"

# Launch T010-T011 together (different aspects of same file):
Task: "Analytics types in src/types/analytics.ts"
Task: "Analytics error classes in src/types/analytics.ts"
```

## Notes

- [P] tasks = different files or independent aspects, no dependencies
- Verify tests fail before implementing (red-green-refactor)
- Use existing Virtual Studio patterns for component structure
- Follow CLAUDE.md guidelines for TypeScript imports and error handling
- Analytics must not impact 60fps rendering performance
- Ensure GDPR compliance throughout implementation

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - analytics-service.ts → contract tests for each method [P]
   - component-integration.ts → React component tests [P]
   
2. **From Data Model**:
   - AnalyticsConfig → type definition task [P]
   - AnalyticsEvent → type definition task [P]
   - ConsentState → type definition task [P]
   
3. **From User Stories (Quickstart)**:
   - Environment setup → validation task [P]
   - Consent flow → integration test [P]
   - Page tracking → integration test [P]
   - Error handling → integration test [P]

4. **Ordering**:
   - Setup → Tests → Types → Service → Components → Integration → Polish
   - Types before service (dependencies)
   - Service before hooks/providers (dependencies)

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (T004-T009)
- [x] All entities have type definition tasks (T010-T011)
- [x] All tests come before implementation (T004-T009 before T010-T020)
- [x] Parallel tasks truly independent (checked file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Environment variable configuration included (T002, T018)
- [x] GDPR compliance tasks included (T008, T013, T019)
- [x] Performance validation included (T023)
- [x] Integration with existing Virtual Studio architecture (T017-T020)