import { JSONValue, Resource } from '@tomic/lib';
import { get } from 'svelte/store';
import { store as storeStore } from './stores/store';

export interface ResourceTreeTemplate {
  [property: string]: true | ResourceTreeTemplate;
}

const normalize = (value: JSONValue): string[] => {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value as string[];
  }

  return [];
};

const isFulfilled = <T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> => {
  return result.status === 'fulfilled';
};

/**
 * Make sure the given tree of resources are available in the store.
 * This is only useful for SSR and SSG as the getResource functions don't wait for the resource to be fully available
 * causing SvelteKit to render incomplete pages.
 *
 * When using **SvelteKit**, make sure you inject the custom fetch function into the store before calling this function.
 *
 * **Example**:
 * ```ts
 * await loadResourceTree('https://myblog.com', {
 *  [myProperties.blogPostCollection]: {
 *   [urls.properties.collection.members]: {
 *    [myProperties.coverImage]: true,
 *    [myProperties.author]: true,
 *  }
 * });
 * ```
 */
export const loadResourceTree = async (
  subject: string,
  treeTemplate: ResourceTreeTemplate,
): Promise<void> => {
  const store = get(storeStore);

  const loadResourceTreeInner = async (
    resource: Resource,
    tree: ResourceTreeTemplate,
  ) => {
    const promises: Promise<unknown>[] = [];

    for (const [property, branch] of Object.entries(tree)) {
      await store.getResourceAsync(property);
      const values = normalize(resource.get(property));
      const resources = (
        await Promise.allSettled(
          values.map(value => {
            return store.getResourceAsync(value);
          }),
        )
      )
        .filter(isFulfilled)
        .map(x => x.value);

      if (typeof branch === 'boolean') {
        continue;
      }

      for (const res of resources) {
        promises.push(loadResourceTreeInner(res, branch));
      }
    }

    return Promise.allSettled(promises.flat());
  };

  const resource = await store.getResourceAsync(subject);

  await loadResourceTreeInner(resource, treeTemplate);
};
