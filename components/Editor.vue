<template lang="pug">
  div.editor-wrap
    .edi
      .ace(ref="aceEditor")
    .compile-button
      button.btn(@click='compile') compile
</template>

<script lang="ts">
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/mode-glsl'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite'

import { Component, Ref, Vue } from 'nuxt-property-decorator'
import { GDStore } from '@/store'
import fragmentShader from './glsl/shader.frag'
@Component({})
export default class Editor extends Vue {
  @Ref() aceEditor!: HTMLDivElement

  editor!: ace.Ace.Editor

  // mounted()
  mounted() {
    this.editor = ace.edit(this.aceEditor, {
      theme: 'ace/theme/monokai',
      mode: 'ace/mode/glsl',
      enableAutoIndent: true,
    })

    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    })

    this.editor.setValue(fragmentShader)
    this.compile()
  }

  // methods()
  compile() {
    GDStore.setCode(this.editor.getValue())
  }
}
</script>

<style lang="stylus" scoped>
.ace
  position relative !important
  margin auto
  height 100%
  width 100%

.edi
  width 50vw
  height calc(100vh - 2rem)

.compile-button
  height 2rem
  background-color red
</style>
