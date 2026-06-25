# Page refinement: design notes

This is a working design note for the automatic page-refinement feature (the `eb refine` command). It records what the feature is trying to do, how the current engine works, where it falls short, and the directions we are considering for a redesign. It is developer-facing background, not user documentation; for how to *use* the feature, see the [Page refinement](_docs/layout/page-refinement.md) docs.

The note exists so that we can rethink the foundational approach from a shared understanding rather than from scratch. It captures the reasoning behind the current architecture and, importantly, the structural reasons it cannot reliably find the solutions a human editor finds by eye.

## Where things live (orientation for picking this up later)

If you are returning to this after a break, start here.

- **User docs:** [`_docs/layout/page-refinement.md`](_docs/layout/page-refinement.md) — how to *use* `eb refine`, including the IAL vocabulary and the `--highlight` flag.
- **The implementation:** `_tools/run/helpers/refine/`. The heart of it is `prince-refine.prince` (the Prince-side detection and fix script); supporting files are `index.js`, `injectScript.js`, and `options.js`. **Note:** `_tools/` is gitignored in this repo — it is installed from the `@electricbookworks/electric-book-modules` npm package. The real source of truth is the **electric-book-modules** repo, branch `auto-refine` (PR #3). Any change tested in `_tools/` here must be synced back to that repo (we have used `npm run update-modules` to pull, and patches to push) or it will be lost on the next install.
- **The two open PRs:** electric-book PR #824 (`auto-refine` branch — docs and this design note) and electric-book-modules PR #3 (`auto-refine` branch — the engine code). Keep both open as the working record.
- **Past-work memory:** Arthur's dotfiles carry accumulated notes on this feature at `~/dotfiles/agents/ebt/memories/` (read `index.md` first). The shared EBT context repo is at `~/.agent-context/ebt/`. These record what was tried, what worked, and the current sync state — check them before resuming.
- **Running a clean test:** the refine process **mutates its input** (it writes IALs into `samples/*.md`), so always `git checkout -- samples/*.md` before a fresh run, and run with `--highlight` to see the proposed fixes colour-coded in the PDF.
- **The two test chains referenced below:** the **altar** chain is in `samples/01-01-plain-text-2.md` (the "I was half-dragged up to the altar" paragraph, and "You see," remarked Holmes); the **Bohemia** coupled-straddle is in `samples/01-01-plain-text-1.md`.

## The problem

Given a book's source (Markdown, rendered to HTML and then laid out by Prince into a PDF at a fixed page geometry), automatically write a small set of annotations into the Markdown that nudge line-breaking and vertical position so that the rendered PDF has fewer typographic bad breaks.

The annotations are Kramdown inline attribute lists (IALs) attached to paragraphs. They are deliberately few and gentle: the aim is the smallest, least intrusive set of nudges that meaningfully improves the page.

### The bad breaks we target

We score each break against a severity scale from 1 (cosmetic) to 7 (worst):

- **short-line** (severity 1): a single-page paragraph whose last line is very short. Purely cosmetic.
- **lone-line-bottom** (severity 2 on a verso, 3 on a recto): the first line of a paragraph stranded at the bottom of a page, with the rest overleaf. (Traditionally called a "widow"; we avoid that word because people disagree on which is which.)
- **lone-line-top** (severity 4–7): the last line of a paragraph stranded at the top of a page, with the rest on the preceding page. (Traditionally an "orphan".) The exact weight depends on whether the lone line is wide or narrow and whether it falls on a recto or verso.

The implicit objective is to **minimise the total weighted severity across the book**, using as few and as gentle annotations as possible.

### The hard constraint

The only way to know the severity of a configuration is to **run a full Prince layout pass**. Fixes are physical: they change real line-breaking, and their effects ripple downstream in ways that cannot be predicted cheaply. So this is **black-box combinatorial optimisation in which each evaluation costs one expensive layout**.

## The fix vocabulary

There are two independent families of annotation, which may coexist on the same paragraph:

- **Letter-spacing (`ls`): `tighten-N` / `loosen-N`.** Subtly adjusts inter-letter spacing, changing line breaks *within* a paragraph. This can save or add a whole line. It is the workhorse.
- **Vertical-shift (`vs`): `add-N` / `save-N`.** Moves a whole chapter opener down or up by *N* whole lines *without* changing any paragraph's line count. Used as a last resort to push a stranded line onto the next page.

Escalation (for example `tighten-10` &rarr; `tighten-12`) happens only within a family: a fix that is not working harder is strengthened in the same direction (more letter-spacing, or a larger vertical shift), never swapped for the other family. So a `tighten` never escalates into an `add`; the two families are chosen and adjusted independently.

## How the current engine works

The engine is a reactive control loop driven by Prince's post-layout hook (`Prince.registerPostLayoutFunc`). After each layout pass it re-measures the page and reacts:

1. **Detect.** Measure every paragraph's line boxes, group them by page, flag each lone-line-bottom, lone-line-top, and short-line, and assign a severity.
2. **Fix greedily, one issue at a time.** For each detected issue apply *one* fix per **wrapper chain** (a chapter) per pass. Strategies, in priority order: tighten an upstream paragraph, then loosen an upstream paragraph, then self-tighten the issue paragraph (for short paragraphs), then vertical-shift the opener (last resort).
3. **Sequencing gate.** Defer a lower-severity issue while a higher-severity issue is still actionable in the same chain, on the theory that fixing the worse one may resolve the milder one for free. A related **coupled-straddle guard** treats a two-line paragraph split across a single break as one problem, not two, so its lone-line-bottom defers to its lone-line-top.
4. **Escalate-or-undo.** Track every fix. If it has not resolved its issue by the next pass, escalate it once; if that still fails, undo it.
5. **Verification sweep.** Once no new fix applies, walk all tracked fixes and undo any whose issue is still present in the final layout. A **relocation gate** keeps a fix that merely *moves* a lone line elsewhere only if the new location's severity is strictly lower than the original. Re-arm and repeat until a sweep settles with nothing undone and nothing shifted.
6. **Effectiveness prune.** Remove any letter-spacing fix that changed neither the line count nor the measure of its target (an inert fix that survived by coincidence).
7. **Budget.** At most 40 fix passes and 45 passes overall.

## A worked example: the altar chain

This chain, from the Sherlock Holmes sample (`samples/01-01-plain-text-2.md`), is the clearest illustration of the engine's limits.

- The paragraph beginning **"I was half-dragged up to the altar"** is 14 lines long and straddles a break, leaving its last line alone at the top of page 29 (a lone-line-top).
- A human editor resolves the chapter with **two self-tightens**: tighten the altar paragraph (saving a line, which pulls its lone line back onto page 28), and tighten **"You see," remarked Holmes** (page 30). Saving a line in the altar paragraph shifts the following text up, which strands a new lone line at the top of page 31; tightening "You see" absorbs that. Two gentle, local fixes clear the whole chain, leaving only a couple of genuinely unsolvable breaks.

The engine **detects** the altar lone-line-top and even applies a `tighten-10` for it. But the verification sweep then **undoes** it: the fix only *relocates* the lone line from page 29 to page 31 at equal severity (6 &rarr; 6), and the relocation gate keeps a relocating fix only when the new severity is strictly lower. (For comparison, the same gate *kept* a fix elsewhere that relocated a lone line from severity 6 to severity 4.) So the altar fix is discarded, the chain is abandoned, and the page-29 lone-line-top survives into the final PDF.

The engine cannot reach the human solution because it never considers applying the **page-29 fix and the page-31 fix together as a set**. Each fix is judged in isolation, and in isolation the first fix looks useless because it just moves the problem.

## Why the current approach falls short

The failure is structural, not a bug:

1. **It is greedy and local, with no explicit objective function.** It reacts to issues one at a time and never evaluates a *candidate set* of fixes against "did total severity actually go down?" It optimises each issue in isolation and hopes the sum is good.
2. **There is no search over sets.** The winning solutions are sets chosen for how their members interact (one fix saves a line that lets a second fix land). The engine has no representation of a "fix set" and never searches that space; it can only stumble into good combinations pass by pass.
3. **The control loop can thrash.** Every fix re-flows the layout, creating and destroying issues elsewhere. The next pass reacts to the new state with no memory of a plan. Coupled chains then oscillate (we have observed the sweep undoing a steady one-to-six fixes per pass and never settling), and when the pass budget cuts the oscillation off mid-cycle, a redundant or wrong fix can survive.
4. **It gives up on solvable chains.** As in the altar example, per-issue reasoning concludes "no fix helps here" when in fact a *combination* of fixes does.
5. **It is not idempotent.** Re-running the engine on already-annotated source finds *new* issues, because the annotations themselves moved the layout. A correct solver should be a fixed point: running it on its own output should propose no change.
6. **The implicit objective is not the real objective.** "Resolve each detected issue" is not the same as "minimise total weighted severity at minimum annotation cost". Sometimes the global optimum deliberately *leaves a severity-1 short-line alone* to avoid creating a severity-6 lone-line-top. The engine has no global score against which to make that trade.

## Reframing the problem

The cleanest way to see it: this is **combinatorial optimisation over a discrete decision space, where the cost function is a black box that costs one Prince layout per evaluation.**

- **Decision variables:** for each paragraph, choose an annotation — none, `tighten-N`, `loosen-N`, `add-N`, or `save-N`.
- **Objective:** minimise the sum of severities plus a penalty &lambda; times the annotation cost (count and distortion).
- **Constraint:** a configuration can only be scored by laying it out.

The current design fuses the decision and the evaluation into a single reactive loop. Separating them is the central idea behind every redesign direction below.

## Candidate architectures

These are directions to think against, not settled proposals.

### A. Global search over fix sets

Keep the physical-layout evaluation, but make the unit of work a *candidate set* of annotations rather than a single fix. Use hill-climbing, beam search, or simulated annealing over fix sets, each scored by the total severity of a real layout, and accept a move only if it lowers the global score. This replaces dozens of reactive passes with fewer, smarter evaluations, and it can find interacting sets like the altar solution.

### B. Predict, then verify

Build a cheap line-break predictor — a model of how many lines a paragraph occupies at a given letter-spacing, from its character count and measure. With it, score thousands of candidate sets *without* invoking Prince, search offline for a minimal-severity set, and run real layouts only to verify the best few. This decouples search from the expensive evaluation and is probably the single biggest available lever.

### C. Two-phase: plan, then apply

From one clean layout, build a dependency model of each chain — which paragraphs straddle which breaks, and how far each candidate tighten or loosen would move a break boundary. Then solve each chain as a small "minimum line-shift to clear the most severity" problem, closer to set cover than to reactive nudging. This is essentially what the human editor does in their head.

### D. Idempotency by construction

Whatever the search, make the final step "given the chosen annotation set, lay out once, confirm severity is at the computed minimum, and guarantee that re-running on the output proposes the empty change-set." Idempotency is both a correctness property and a useful test.

The thread through all four: **separate the decision (which set of annotations) from the evaluation (lay it out and score it), and give the decision an explicit global objective.**

## Status

The current engine, with the coupled-straddle guard and effectiveness-prune pass, converges cleanly on the samples on a clean run and produces sensible, minimal annotations for the chains it can solve. Its severity model, recto/verso weighting, two fix families, and consistency guarantees (escalate-or-undo, verification sweep) are sound and worth carrying forward. The open work is the optimisation strategy: moving from greedy per-issue reaction to global, set-level search with an explicit objective.
