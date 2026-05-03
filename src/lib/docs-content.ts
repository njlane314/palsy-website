export const documentationNav = [
  {
    group: "Getting started",
    items: [
      { label: "Quickstart", href: "#docs-quickstart" },
      { label: "Five-minute demo", href: "#docs-five-minute-demo" },
      { label: "Demo transcript", href: "#docs-demo-transcript" },
      { label: "Example CI gate", href: "#docs-ci-gate" },
    ],
  },
  {
    group: "Admission control",
    items: [
      { label: "Workflow overview", href: "#docs-workflow" },
      { label: "Policy decisions", href: "#docs-policy" },
      { label: "Signed permits", href: "#docs-permits" },
    ],
  },
  {
    group: "Deployment",
    items: [
      { label: "GitHub Actions", href: "#docs-github-actions" },
      { label: "Self-hosted API", href: "#docs-self-hosted-api" },
      { label: "Internal repository", href: "#docs-internal-repository" },
    ],
  },
  {
    group: "Reference",
    items: [
      { label: "CLI commands", href: "#docs-cli" },
      { label: "API endpoints", href: "#docs-api" },
      { label: "Release evidence", href: "#docs-release-evidence" },
    ],
  },
];

export const docToc = [
  { label: "First time here?", href: "#docs-first-time" },
  { label: "Admission workflow", href: "#docs-workflow" },
  { label: "Deployment", href: "#docs-deployment" },
  { label: "Reference", href: "#docs-reference" },
];

export const docIntroPanels = [
  {
    title: "Admission evidence",
    body: "Every allowed dependency graph can produce a signed permit that downstream jobs verify.",
  },
  {
    title: "Environment-aware policy",
    body: "Run softer observe decisions locally and enforce stricter policy in CI or production.",
  },
  {
    title: "Self-hosted control",
    body: "The service stores quarantine, mirror files, review decisions, revocations, scans, and permits in local state.",
  },
];

const fiveMinuteDemoTranscript = `$ python examples/five_minute_demo.py
Palsy 5-minute demo: malicious package admission
1. Built malicious wheel: examples/artefacts/five-minute-demo/credential_stealer_demo-0.1.0-py3-none-any.whl
2. Quarantined exact artefact: examples/artefacts/five-minute-demo/quarantine/ec85e70f...fbc4bcad.whl
3. Static scan max severity: critical
4. Policy decision: DENY
5. Review outcome: denied; no mirror promotion and no signed permit

Decision reasons:
- static scan maximum severity critical exceeds medium
- executable .pth startup hook is not allowlisted
- upstream upload timestamp is unavailable
- package has sensitive import-time behaviour
- artefact references network behaviour`;

export const docGroups = [
  {
    id: "docs-first-time",
    title: "First time here?",
    body: "Start with a local observe run. Once the output matches your risk appetite, turn the same lockfile assessment into a CI gate.",
    cards: [
      {
        id: "docs-quickstart",
        title: "Quickstart",
        body: "Create repository policy and run without failing the build.",
        code: `palsy init
palsy gate requirements.txt --mode observe`,
      },
      {
        id: "docs-five-minute-demo",
        title: "Five-minute demo",
        body: "Build a malicious package, quarantine it, review the decision, and deny admission.",
        code: `python examples/five_minute_demo.py`,
      },
      {
        id: "docs-demo-transcript",
        title: "Demo transcript",
        body: "The homepage keeps the demo simple. This is the technical output, including the generated artefact path, quarantine path, decision, and reasons.",
        code: fiveMinuteDemoTranscript,
      },
      {
        id: "docs-ci-gate",
        title: "Example CI gate",
        body: "Fail CI unless the lockfile receives an allowed admission decision.",
        code: `palsy gate requirements.txt \\
  --mode enforce \\
  --environment ci`,
      },
    ],
  },
  {
    id: "docs-workflow",
    title: "Admission workflow",
    body: "Palsy resolves exact artefacts, downloads them into quarantine, scans static signals, applies policy, promotes allowed files, and signs permit evidence.",
    cards: [
      {
        id: "docs-policy",
        title: "Policy decisions",
        body: "Allow clean artefacts, require review for ambiguous risk, and deny packages with critical signals.",
        code: `decision: deny
reasons:
  - executable .pth startup hook
  - import-time credential access`,
      },
      {
        id: "docs-permits",
        title: "Signed permits",
        body: "Verify that the exact lockfile and environment were admitted before deployment continues.",
        code: `palsy verify-permit \\
  .palsy/permits/requirements.txt.permit.json \\
  --lockfile requirements.txt \\
  --environment ci`,
      },
    ],
  },
  {
    id: "docs-deployment",
    title: "Deployment",
    body: "Adopt the gate directly in CI first, then add the self-hosted API and internal repository when the review workflow needs a shared control plane.",
    cards: [
      {
        id: "docs-github-actions",
        title: "GitHub Actions",
        body: "Use the composite action for pull request and main branch enforcement.",
        code: `- uses: njlane314/palsy@v0.3.0
  with:
    mode: enforce
    environment: ci
    policy: .palsy/policy.yaml
    licence: .palsy/licence.json
    lockfiles: |
      requirements.txt
      package-lock.json`,
      },
      {
        id: "docs-self-hosted-api",
        title: "Self-hosted API",
        body: "Run the API locally or behind your internal network for centralised assessment.",
        code: `docker compose up --build -d
curl -fsS http://127.0.0.1:8080/healthz`,
      },
      {
        id: "docs-internal-repository",
        title: "Internal repository",
        body: "Serve approved PyPI files through /simple/{project}/, approved npm packages through /npm/{package}, and files by digest.",
        code: `pip install \\
  --index-url http://palsy.local/simple/ \\
  -r requirements.txt`,
      },
    ],
  },
  {
    id: "docs-reference",
    title: "Reference",
    body: "Keep the buyer-facing reference compact: command surface, API surface, release evidence, and what auditors can verify.",
    cards: [
      {
        id: "docs-cli",
        title: "CLI commands",
        body: "Initialise policy, assess lockfiles, issue permits, and verify downstream evidence.",
        code: `palsy init
palsy gate requirements.txt --mode enforce
palsy verify-permit permit.json --lockfile requirements.txt`,
      },
      {
        id: "docs-api",
        title: "API endpoints",
        body: "Assess artefacts and lockfiles, list review items, approve by digest, revoke digests, and serve approved files.",
        code: `POST /v1/artifacts/assess
POST /v1/lockfiles/assess
GET  /v1/permits/{permit_id}
GET  /v1/permits/by-digest/{digest}
POST /v1/reviews/{digest}/approve`,
      },
      {
        id: "docs-release-evidence",
        title: "Release evidence",
        body: "The release workflow is wired to publish checksums, an SBOM, attestations, a Docker image, and PyPI distributions from signed v* tags.",
        code: `dist/
  palsy-0.3.0.tar.gz
  checksums.txt
  sbom.spdx.json
  provenance.intoto.jsonl`,
      },
    ],
  },
];
