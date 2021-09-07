import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import GlslData from '@/store/glsl-data'

// eslint-disable-next-line import/no-mutable-exports
let GDStore: GlslData

function initializeStores(store: Store<any>): void {
  GDStore = getModule(GlslData, store)
}

export { initializeStores, GDStore }
