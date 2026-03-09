---
title: Clean Code
---

## Code Rules

### Naming

#### Prefer Long Descriptive Names

Names should clearly express intent.

Guidelines:

- avoid abbreviations
- prefer descriptive identifiers
- ensure names are pronounceable
- avoid meaningless noise words
- names should explain intent without reading the implementation

#### One Name = One Concept

Use consistent vocabulary across the codebase.

Do not mix synonyms for the same operation.

Consistency improves readability and collaboration.

#### Do Not Reuse Names

Different concepts must have different names.

Reusing variable names for unrelated roles creates confusion and makes bugs harder to detect.

#### Don't Lie

Identifiers must reflect actual behavior.

Misleading names damage readability and lead to incorrect assumptions by readers.

### Code Structure

#### Self-Explaining Code Over Comments

Prefer code that explains itself.

If comments are needed, the code likely requires refactoring.

Function names should often replace explanatory comments.

#### A Function Should Do One Thing

Functions must have a single responsibility.

If a function performs multiple tasks, split it into smaller functions.

Avoid functions that mix:

- computation
- I/O
- state mutation

#### Keep Functions Small

Short functions improve readability.

Guidelines:

- avoid deep nesting
- split logic into smaller functions
- prefer composition of small functions

#### Code Should Grow Upward

Organize code so that:

- high-level logic appears first
- implementation details appear later

Readers should understand **intent before implementation**.

#### Group Related Code

Keep related definitions and usage close together.

Large distances between definitions and usage reduce readability.

### Function Design

#### Minimize Function Arguments

Prefer functions with:

- zero arguments
- one argument
- two arguments

More arguments significantly reduce readability.

If many parameters are needed, group them into objects or configuration structures.

#### Avoid Side Effects

Side effects create time-dependent behavior and hidden dependencies.

Functions should ideally behave as:

input → output

Avoid modifying external state unless explicitly required.

### Error Handling

#### Prefer Exceptions Over Error Codes

Error codes complicate caller logic and mix business logic with error handling.

Exceptions allow:

- clearer control flow
- better debugging context
- separation of concerns

#### Avoid Returning Null

Returning `null` pushes responsibility to the caller and increases defensive code.

Prefer:

- exceptions
- explicit result objects
- empty collections

### State Management

#### Prefer Immutable Variables

Immutable values reduce bugs and unexpected side effects.

Avoid mutating inputs.

Instead, create new values when transformations are needed.

#### Avoid Global Variables

Global variables create hidden dependencies and reduce extensibility.

Problems caused by global state:

- unpredictable behavior
- difficult debugging
- tight coupling

Dependencies should be passed explicitly.

### Architecture

#### Think Carefully Before Creating Classes

Classes introduce context and constraints.

When possible, implement business logic as standalone functions.

Functions are easier to reuse and compose.

#### Avoid Inheritance

Inheritance introduces hidden coupling and propagation of changes.

Problems:

- fragile hierarchies
- implicit dependencies
- increased complexity

Prefer:

- composition
- modular functions
