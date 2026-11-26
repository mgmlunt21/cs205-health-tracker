# AI Usage Summary

## Tools used

| Tool | How I used it | Main tasks |
|------|---------------|------------|
| Claude Code (in a claude.ai project) | An agent with access to the project files. I gave it tasks in plain English, one task per thread, and reviewed the results in the browser. | Planning, all new features, bug fixes, unit tests, README and this summary |

## How AI helped

### Planning
I asked Claude to read the starter code and the assignment README first. It summarized the rubric, listed weak spots in the starter (file pickers that opened on page load and were blocked by the browser, imports that weren't validated, empty days drawn as 0 on the weekly chart), and proposed a project plan. Later I asked it to compare what we had built against the README's feature suggestions and to sort the remaining ideas into easy, medium and hard. I picked which ones to build.

### Coding
Claude wrote most of the code. I directed what to build, tested each feature, and asked for changes.

- **Sleep, water and exercise trackers:** changed the data model from a single mood list into one object holding a list per tracker, with shared `addEntry`/`deleteEntry`, a shared entry list and a reusable trend chart.
- **Meals tracker, mood journal notes, bedtime/wake time, exercise calories, editable water goal.**
- **Analytics:** Overview tab with averages and streaks, a sleep vs mood correlation chart, a mood calendar heatmap, and week/month/year ranges on every chart.
- **Dark mode**, using Tailwind's `class` strategy and a few shared component classes.
- **Editing entries and logging for past dates**, built as one shared form hook (`EntryForm.jsx`) instead of five separate copies.
- **Autocomplete** for 40 exercise types and for meals I'd logged before.
- **Import validation** for every field (`parseData` in `src/utils/entries.js`) and **24 Vitest unit tests** for the validation and stats code.

### Debugging
- **Light mode looked broken on my computer** (dark cards with dark text). I sent Claude screenshots. It reproduced the problem in a Chrome with forced dark mode and worked out that Chrome's auto-dark feature was darkening the page on top of the app's own light theme. The fix was one `<meta name="color-scheme">` tag. Its first attempt (setting `color-scheme: light`) didn't work, and it caught that in its own test before handing it to me.
- **Stats cards rendered with bullet points**, and the Delete buttons wrapped onto a new line. Claude found that its CSS class name `list-item` clashed with Tailwind's built-in `display: list-item` utility, and renamed it.

### Other
- Generated a 60-day sample data set where mood loosely follows sleep, so the correlation chart and heatmap have something to show in the demo.
- Tested each change in a headless browser (adding, editing, deleting, importing, reloading, dark mode) before copying it to my computer.

## Limitations and issues

| Issue | What happened | How I handled it |
|-------|---------------|------------------|
| Overwrote other work | Two Claude threads edited the same files at the same time. One overwrote the other's bug fixes. | The agent noticed the conflict, read the other thread's changes and merged them back in. I now keep one copy of the code that only one task edits at a time. |
| Changed files I wanted kept | When I asked it to copy changes to my computer, it replaced files in my original starter folder. | I asked it to restore the originals from the starter zip and put all new work in a separate `Claude CS205 Project` folder. It confirmed every file matched the zip. |
| Over-engineering / defensive code | The assignment warns about this, so I asked for lean code from the start. Repeated logic was pulled into shared pieces (one entry list, one chart, one form hook), and validation is only on user input and file import. | Reviewed the shared pieces and kept them, since each one is used by several trackers. |
| Secrets / API keys | N/A. The app has no backend or external services. | N/A |
| Guesses | It made choices I hadn't specified, such as a 2000 ml default water goal and separate tabs per tracker. It listed these guesses so I could change them. | Reviewed each guess and kept the ones that made sense. |

## How I reviewed AI-generated code

I tried every feature in the browser after each change, compared screenshots in light and dark mode, asked the agent to explain anything unclear, and ran `npm test`. I made clear to Claude that the code should not be over-engineered and asked it to keep validation only where user input comes in.

## Takeaways

Claude was very good at implementing my suggestions and outlining what it would be doing. Claude also helped me walk through how to test the app. One thing it did that I did not like was when it overwrote my original starter files, but it was able to undo it. Next time I would use Git from the start so any change is easy to roll back.
