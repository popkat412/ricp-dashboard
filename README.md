# RICP Dashboard

## Docs

### Firestore data model

- collection `members` (members of RICP)
  - document `<auto generated id>` (artificial id we give each member in case they have the same name or smth) 
    - string `name`
    - subcollection `history`
      - document `<auto generated id>`
        - integer | null `change`
        - timestamp `timestamp`
        - string `message`
        - string `adminId`
        - string | null `taskId` (the task associated with this addition of points)
- collection `tasks`
  - document `<auto generated id>`
    - string `title`
    - string `description`
    - timestamp `dateAdded`
    - timestamp | null `expiryDate`
    - boolean `expired`
    - string `scoreFnName` *
    - map `scoreFnParams`
- collection `users` (admin users)
  - document `<uid>` (uid from firebase auth)
    - string `name`

\* see score functions docs below

### Score Functions

A score function `f(x)` for a task gives the score of the task `x` days after
the task was first set (can be overridden with a start date).

#### Parameters shared by all score functions

- `ST = Current day`, the "start time" of the function. The function will be called as
`f(x - ST)`.
- `LB = 0`, the lower bound of the score function. The score function will be clamped
between `L` and `U`
- `UB = Infinity`, the upper bound of the score function. The score function will be clamped
between `L` and `U`

#### Constant

**Mathematical expression**: `f(x) = C`
**Additional parameters**:
- `C = 100`, the number of points this task will be worth, always (the lower and
upper bounds will still apply)

#### Linear

**Mathematical expression**: `f(x) = -Mx + C` (the negative is there for convenience)
**Additional parameters**:
- `M = 10`, the number of points that gets subtracted every day from the day 0 score
- `C = 100`, the original number of points the task is worth on day 0 (i.e. if they solve
it the day the task is announced)

I might add more (such as exponential) in the future.

## Project Info

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).
