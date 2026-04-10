# jsTree v4

A modern, vanilla JavaScript tree library for rendering and interacting with hierarchical data.

This repository contains the **v4 rewrite** of jsTree. The current codebase removes the jQuery dependency, introduces a separate data layer, and includes an infinite-scroller renderer intended to handle very large trees efficiently.

> **Status:** work in progress. The library is already usable for experimentation and development, but parts of the API and documentation may continue to evolve.

## Why jsTree

jsTree helps you display and manipulate tree-structured data in the browser.

Typical use cases include:

- file and folder explorers
- category trees
- navigation sidebars
- permission hierarchies
- product or content taxonomies
- lazy-loaded trees backed by remote data

## Key features

- **Vanilla JavaScript** — no jQuery required
- **Large dataset support** — includes an infinite-scroller renderer
- **Configurable data model** — separate data and rendering layers
- **Async-friendly** — suitable for lazy loading and remote data sources
- **Extensible architecture** — designed to be extended and themed

## Project structure

The repository is organized around source files and generated distribution files:

- `src/` — source code
- `dist/` — generated browser-ready files
- `dist/index.html` — simple demo page included in the repository

If you are contributing or modifying the library, work in `src/`, not in `dist/`.

## Installation

### Use the prebuilt distribution files

Include the generated CSS and JavaScript from `dist/` in your page:

```html
<link rel="stylesheet" href="dist/jstree.css">
<script src="dist/jstree.js"></script>
```

For production, use the minified files:

```html
<link rel="stylesheet" href="dist/jstree.min.css">
<script src="dist/jstree.min.js"></script>
```

### Install dependencies for development

```bash
npm install
```

## Build

This fork uses Rollup to generate the distribution files.

```bash
npm run build
```

Expected outputs:

- `dist/jstree.js`
- `dist/jstree.min.js`
- `dist/jstree.css`
- `dist/jstree.min.css`

## Quick start

Create a container element in your HTML:

```html
<div id="tree"></div>
```

Then initialize the tree in JavaScript.

```js
import jsTree from './src/jstree.js';

const tree = new jsTree(document.getElementById('tree'), {
  data: [
    {
      id: 'root',
      text: 'Root',
      children: [
        { id: 'a', text: 'Child A' },
        { id: 'b', text: 'Child B' }
      ]
    }
  ]
});
```

If you are using the prebuilt browser bundle from `dist/jstree.js`, initialize it according to how the bundle is exposed in your application setup.

## Data format

A tree is typically described as nested nodes. A minimal node usually contains:

- `id` — unique identifier
- `text` — label shown to the user
- `children` — nested child nodes

Example:

```js
const data = [
  {
    id: '1',
    text: 'Documents',
    children: [
      {
        id: '2',
        text: 'Reports',
        children: [
          { id: '3', text: 'Q1.pdf' },
          { id: '4', text: 'Q2.pdf' }
        ]
      },
      {
        id: '5',
        text: 'Invoices'
      }
    ]
  }
];
```

## Lazy loading

For large datasets, load children only when needed instead of sending the whole tree up front.

A common approach is:

1. render only root nodes initially
2. detect when a node is expanded
3. fetch that node's children from your backend
4. inject the returned children into the tree model

This keeps startup fast and works well with large hierarchies.

## Styling and themes

The distribution CSS provides the default styling for the tree.

```html
<link rel="stylesheet" href="dist/jstree.css">
```

You can override the shipped styles with your own CSS to adapt spacing, icons, row height, colors, and hover/selection appearance.

## Development notes

- This is the **v4** branch of jsTree, and it is a rewrite rather than a small incremental update.
- The codebase is intended for modern browsers.
- The included demo page in `dist/index.html` is the fastest way to inspect current behavior.

## Migration notes

If you used older jsTree versions:

- do not assume jQuery-based initialization still applies
- expect API and internal architecture changes
- review source and demo code when upgrading custom integrations

## Contributing

Contributions are welcome.

General guidelines:

1. make changes in `src/`
2. rebuild the distribution files with `npm run build`
3. avoid editing generated files in `dist/` directly
4. keep examples and documentation aligned with actual output

## License

MIT License.

Copyright (c) Ivan Bozhanov.
