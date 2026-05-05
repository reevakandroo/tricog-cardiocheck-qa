# Tricog CardioCheck — QA Framework

End-to-end quality assurance suite for the **Tricog CardioCheck** Flutter Web application.

## Quick Start

```bash
npm install
npx playwright install chromium --with-deps
mkdir -p reports/screenshots
npm run full   # run all tests + generate HTML report
```

## Structure

```
tricog-cardiocheck-qa/
├── docs/
│   ├── application_understanding.txt   # App deep-dive: user stories, flows, anomalies, questions
│   └── verification_plan.md            # Test strategy, scope, risk prioritization
├── test-cases/
│   ├── preconditions/                  # PC_001–PC_012 setup requirements
│   ├── TC_Login/                       # TC_LGN_001–015
│   ├── TC_ECG_Dashboard/               # TC_ECG_001–010
│   ├── TC_Patient_Info/                # TC_PAT_001–020
│   ├── TC_Risk_Assessment/             # TC_RSK_001–010
│   ├── TC_Report_Export/               # TC_RPT_001–010
│   ├── TC_Search_Bar/                  # TC_SRC_001–010
│   ├── TC_Profile/                     # TC_PRF_001–005
│   ├── TC_Network/                     # TC_NET_001–006
│   ├── TC_Security/                    # TC_SEC_001–009
│   ├── TC_HIPAA/                       # TC_HIPAA_001–006
│   ├── TC_Multi_Center/                # TC_MCT_001–003
│   └── TC_Omron_Integration/           # TC_OMR_001–005
├── tests/playwright/
│   ├── helpers.js                      # Shared utilities: login, ECG seeding, Flutter a11y
│   ├── playwright.config.js
│   ├── 01_authentication.spec.js
│   ├── 02_ecg_dashboard.spec.js
│   ├── 03_patient_form.spec.js
│   ├── 04_risk_assessment.spec.js
│   ├── 05_report_export.spec.js
│   ├── 06_search.spec.js
│   ├── 07_profile.spec.js
│   ├── 08_network.spec.js
│   ├── 09_security.spec.js
│   ├── 10_hipaa.spec.js
│   └── 11_omron.spec.js
├── reports/                            # Generated execution reports + screenshots
├── scripts/
│   └── generate_report.js             # HTML report generator
├── ci/.github/workflows/qa.yml        # GitHub Actions CI/CD
├── SKILL.md                           # Shareable testing skills guide
└── README.md
```

## App Under Test

| Property | Value |
|----------|-------|
| App URL | https://cardiocheck-releasev140.up.railway.app |
| Test Account | reeva.kandroo+8@tricog.com |
| Mock ECG API | https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample |
| Stack | Flutter Web (CanvasKit) + Go/Gin backend + AWS Cognito |

## Mock ECG Generation

```bash
# Generate a high-risk ECG (also: low, moderate)
curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
  -H "x-mock-token: mock-ingest-s3cr3t" \
  -H "content-type: application/json" \
  -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"high"}'
```

ECG appears in the app within ~30 seconds.

## Modules Covered

| Module | TCs | Automation |
|--------|-----|-----------|
| Authentication | 15 | ✅ |
| ECG Dashboard | 10 | ✅ |
| Patient Form | 20 | ✅ |
| Risk Assessment | 10 | ✅ |
| Report Export | 10 | ✅ |
| Search Bar | 10 | ✅ |
| Profile | 5 | ✅ |
| Network Connectivity | 6 | ✅ |
| Security | 9 | ✅ |
| HIPAA Compliance | 6 | ✅ |
| Multi-Center | 3 | ✅ |
| Omron Integration | 5 | ✅ |
| **Total** | **109** | **100%** |

## CI/CD

The `ci/.github/workflows/qa.yml` workflow:
- Runs on push to `main`, PRs, and nightly at 2am IST
- Supports `workflow_dispatch` with module selector
- Uploads HTML report + screenshots as artifacts
- Checks upstream CardioCheck repo for new commits (nightly)

Copy `ci/.github/` to the repo root to activate GitHub Actions.

## Adding Tests for New Features

1. Create `test-cases/TC_NewFeature/TC_NFT_XXX.md` files
2. Create `tests/playwright/12_new_feature.spec.js`
3. `npm run full` to validate
4. Push — CI runs automatically

See [SKILL.md](./SKILL.md) for Flutter Web testing patterns and gotchas.
