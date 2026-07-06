# Graph Report - afuturemodern-landing  (2026-07-06)

## Corpus Check
- 21 files · ~560,014 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 181 nodes · 176 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `23b8e446`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `AFuture Modern Knowledge Base` - 24 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 16 edges
4. `6b9895cc-9bd2-4987-8fc6-f482c91b6ca2 implementation handoff` - 14 edges
5. `scripts` - 8 edges
6. `Ponytail` - 8 edges
7. `Getting Started` - 5 edges
8. `ProjectModal()` - 3 edges
9. `TalentModal()` - 3 edges
10. `useProjectFormStore()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `ProjectModal()` --calls--> `useProjectFormStore()`  [EXTRACTED]
  src/components/ProjectModal.tsx → src/hooks/useProjectFormStore.ts
- `TalentModal()` --calls--> `useTalentFormStore()`  [EXTRACTED]
  src/components/TalentModal.tsx → src/hooks/useTalentFormStore.ts

## Import Cycles
- None detected.

## Communities (16 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (24): Additional Venture Labor Terms, Advantages, AFuture Modern Knowledge Base, Brand, Values, and Strategic Direction, Comparison With Upwork, Fiverr, and Similar Platforms, Cooperative Structure and Venture Labor OS, Direct Labor versus Administration, Executive Summary (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (20): dependencies, concurrently, cors, dotenv, express, gsap, multer, react (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (9): PILLARS, TalentModal(), TalentModalProps, wordCount(), defaultData, storedData, TalentFormData, UploadedFile (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (13): ENGAGEMENT_LENGTHS, PILLARS, ProjectModal(), ProjectModalProps, TagInputProps, wordCount(), WORK_ARRANGEMENTS, ScrollCueProps (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): 6b9895cc-9bd2-4987-8fc6-f482c91b6ca2 implementation handoff, Assets and supporting files, Brand Colors, CJX-ready UX contract, Coding checklist for AI tools, Color and brand contract, Design fidelity contract, Entry points (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (10): Deployment, Environment variables, Getting Started, Install, Prerequisites, Project Structure, Run (dev), Scripts (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (8): Boundaries, Intensity, Output, Persistence, Ponytail, Rules, The ladder, When NOT to be lazy

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (8): scripts, build, dev, dev:client, dev:server, preview, start, start:prod

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): app, __dirname, __filename, resend, upload

## Knowledge Gaps
- **134 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `private`, `version` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._