import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import auth     from './auth-store'
import bid      from './bid-store'
import color    from './color-store'
import drop     from './drop-store'
import dropItem from './drop-item-store'
import invoice  from './invoice-store'
import user     from './user-store'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      bid,
      color,
      drop,
      dropItem,
      invoice,
      user
    },
    mutations: {
      ...vuexfireMutations
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
