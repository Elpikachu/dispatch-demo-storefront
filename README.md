# Trailhead Supply Co. — demo storefront

A deliberately small Node.js + Express app used to demo **Upsun Dispatch** (Issue to code + Code review)
with preview environments on **Upsun Cloud**.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm test
```

- Deployed on Upsun Cloud via `.upsun/config.yaml`; every pull request gets its own environment.
- CI (`.github/workflows/ci.yml`) runs lint and tests in parallel, in well under a minute.
- Presenter material lives in [`DEMO.md`](DEMO.md) and [`demo/`](demo/).
