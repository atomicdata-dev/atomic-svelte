# @tomic/svelte

An implementation of Atomic Data for [Svelte](https://svelte.dev/).
This library is still at an early stage and the API is subject to change.

## Quick Examples

### Getting a resource and displaying one of its properties
```html
  <script lang="ts">
    import { getResource, getValue } from '@tomic/svelte';
    import { urls } from '@tomic/lib';

    const resource = getResource('https://example.com/');
    const name = getValue<string>(resource, urls.properties.name);
  </script>

  <h1>{$name}</h1>
```

### Changing the value of a property with an input field
```html
  <script lang="ts">
    import { getResource, getValue, setValue } from '@tomic/svelte';
    import { urls } from '@tomic/lib';

    const resource = getResource('https://example.com/');
    const name = getValue<string>(resource, urls.properties.name);
  </script>

  <input bind:value={$name} />
```

## Getting started

Install the library with your prefered package manager: <br />
```
npm install -S @tomic/svelte @tomic/lib
```
```
yarn add @tomic/svelte @tomic/lib
```
```
pnpm add @tomic/svelte @tomic/lib
```

Initialise the store
```html
// App.svelte

<script lang="ts">
  import { initStore } from '@tomic/svelte';
  import { Store } from '@tomic/lib';

  onMount(() => {
    // This is where you configure your atomic data store.
    const store = new Store();
    initStore(store);
  })
</script>

// do sveltey things
```

You can now acces this store from any component in your app with the store store.
```html
// Some random component.svelte

<script lang="ts">
  import { store } from '@tomic/svelte';

  const resource = $store.getResourceLoading('https://atomicdata.dev/documents/tgzamh5hk2t');
</script>
```

However this resource does not update when some of its data changes somewhere else in your app.
That's where the `getResource` and `getValue` functions come in handy.

To get a value and display it in your component we first retrieve (or create) a resource from the store with `getResource` and then get it's value with `getValue`.

```html
// Some random component.svelte

<script lang="ts">
  import { getResource, getValue } from '@tomic/svelte';
  import { urls } from '@tomic/lib';

  const resource = getResource('https://example.com/');
  const name = getValue<string>(resource, urls.properties.name);
</script>

<main>
  <h1>{$name}</h1>
  ...
```

Updating values of a resource is super simple, just do what you would normaly do with a writable svelte store:
```ts
const value = getValue<string>(resource, urls.properties.name);

$value = "New Value";
```

The value now updates and changes will permeate through the store.
