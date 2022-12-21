import { Store, urls } from '@tomic/lib';
import { describe, it, expect, beforeEach } from 'vitest';
import { getResource, initStore, store } from '~/index';
import { get } from 'svelte/store';

const resource1Subject = 'https://resource1';

describe('getResource', () => {
  beforeEach(() => {
    const newStore = new Store();

    initStore(newStore);
  });

  it('should get a resource from the store', () => {
    const _store = get(store);

    _store.getResourceLoading(resource1Subject, { newResource: true });

    const resourceStore = getResource(resource1Subject);
    const resource = get(resourceStore);

    expect(resource).not.toBe(undefined);
    expect(resource.getSubject()).toBe(resource1Subject);
  });

  it('should update when the resource changes', async () => {
    const _store = get(store);

    const createdResource = _store.getResourceLoading(resource1Subject, {
      newResource: true,
    });

    const resourceStore = getResource(resource1Subject);
    const resourceStore2 = getResource(resource1Subject);

    const resourceFirst = get(resourceStore);

    expect(resourceFirst.get(urls.properties.name)).toBe(undefined);

    createdResource.setUnsafe(urls.properties.name, 'Resource 1');

    const resourceSecond = get(resourceStore2);

    expect(resourceSecond.get(urls.properties.name)).toBe('Resource 1');
  });
});
