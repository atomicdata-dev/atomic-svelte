import { type FetchOpts, Resource } from '@tomic/lib';

import { type Readable, get, readable } from 'svelte/store';
import { store } from './store';

export const getResource = (
  subject: string,
  opts?: FetchOpts,
): Readable<Resource> => {
  const adStore = get(store);

  // eslint-disable-next-line prefer-const
  let resource = readable<Resource>(undefined, set => {
    set(adStore.getResourceLoading(subject, opts));

    const subscriber = (changedResource: Resource) => {
      set(changedResource);
    };

    adStore.subscribe(subject, subscriber);

    return () => adStore.unsubscribe(subject, subscriber);
  });

  return resource;
};
