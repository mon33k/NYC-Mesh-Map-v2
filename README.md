# NYC Mesh Map v2

NYC Mesh map refactor, still lots to do but this what it is so far!

## Run

```bash
npm install
npm run dev
```

## Stack

- React
- Vite
- TypeScript
- Redux
- MapLibre
- DeckGL

## Podman

```
podman build . --tag willnilges:map-v2
podman run --rm -it -p 8080:80 --name map-v2 willnilges:map-v2
```
