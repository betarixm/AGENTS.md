---
title: Python
---

## Rules

- Use `uv` as the package manager for Python projects.
- Use `pathlib` for all file system operations instead of `os` or `shutil`.
- Use `pydantic` for data validation and modeling instead of dataclasses or manual validation.
- Follow the directory structure outlined below for organizing code and resources in Python projects.
- Avoid using global variables; instead, use function parameters and return values to manage state and data flow.
- Prefer list comprehensions and generator expressions for creating lists and iterators, rather than using traditional loops and appending to lists.
- Prefer lazy evaluation and generators over eager evaluation when working with large datasets or streams of data to improve performance and reduce memory usage.

## Directory Structure

.
├── packages
│   └── [package name]
│       ├── [singular form notion]
│       │   ├── __init__.py
│       │   ├── protocols.py
│       │   ├── models.py
│       │   ├── functions.py
│       │   ├── ...
│       │   └── types.py
│       ├── [singular form notion]
│       │   ├── __init__.py
│       │   ├── protocols.py
│       │   ├── models.py
│       │   ├── functions.py
│       │   ├── ...
│       │   └── types.py
├── pyproject.toml
├── README.md
├── scripts
│   ├── ...
├── uv.lock
