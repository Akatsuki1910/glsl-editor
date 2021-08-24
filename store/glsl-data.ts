import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'glsl-data',
  stateFactory: true,
  namespaced: true,
})
export default class GlslData extends VuexModule {
  code = ''

  @Mutation
  setCode(code: string) {
    this.code = code
  }

  get getCode() {
    return this.code
  }
}
