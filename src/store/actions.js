import {
  fetchUser,
  fetchItems,
  fetchIdsByType,
  fetchSimilar
} from '../api'

export default {
  // ensure data for rendering given list type
  FETCH_LIST_DATA: ({ commit, dispatch, state }, { type }) => {
    commit('SET_ACTIVE_TYPE', { type })
    return fetchIdsByType(type)
      .then(ids => commit('SET_LIST', { type, ids }))
      .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))
  },

  // ensure all active items are fetched
  ENSURE_ACTIVE_ITEMS: ({ dispatch, getters }) => {
    return dispatch('FETCH_ITEMS', {
      ids: getters.activeIds
    })
  },

  FETCH_ITEMS: ({ commit, state }, { ids }) => {
    // on the client, the store itself serves as a cache.
    // only fetch items that we do not already have, or has expired (3 minutes)
    const now = Date.now()
    ids = ids.filter(id => {
      const item = state.items[id]
      if (!item) {
        return true
      }
      if (now - item.__lastUpdated > 1000 * 60 * 3) {
        return true
      }
      return false
    })
    if (ids.length) {
      return fetchItems(ids)
        .then(items => {
          // Only fetch similar items for stories
          let stories = items.filter(x => {
            if (x !== null && x !== undefined && x.hasOwnProperty('type')) {
              return x.type === 'story'
            }
            return false;
          })

          return fetchSimilar(stories.map(item => item.title))
            .then(similar => stories.map((item, idx) => {
              item.similar = similar[idx];
              return item;
            }))
            // Start fetching similar posts (potential performance issue...)
            .then((stories) => {
              return fetchItems(stories.map(i => i.similar).flat().map(sim => sim.id))
                .then(similarItems => {
                  stories.forEach(item => {
                    item.similar = item.similar.map(sim => {
                      const simItem = similarItems.find(si => si.id === sim.id);
                      return Object.assign({ similarity_score: sim.score }, simItem);
                    });
                  });
                  return stories;
                });
            })
            .then((_) => { return items });
          // Stop fetching similar posts (potential performance issue...)

        })
        .then(items => commit('SET_ITEMS', { items }))
    } else {
      return Promise.resolve()
    }
  },

  FETCH_USER: ({ commit, state }, { id }) => {
    return state.users[id]
      ? Promise.resolve(state.users[id])
      : fetchUser(id).then(user => commit('SET_USER', { id, user }))
  }
}
