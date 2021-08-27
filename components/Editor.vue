<template lang="pug">
  div.editor-wrap
    .edi
      .ace(ref="aceEditor")
    .button
      button.btn(@click='compile') compile
      button.btn(@click='repeat') repeat
    canvas.e-check(ref="eCheck")
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
  @Ref() eCheck!: HTMLCanvasElement

  editor!: ace.Ace.Editor
  gl: WebGLRenderingContext | null = null

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
    this.editor.gotoLine(1, 0, true)
    this.compile()
  }

  // methods()
  compile() {
    const fs = this.editor.getValue()
    let canvas: HTMLCanvasElement | undefined = undefined
    if (!canvas) {
      canvas = this.eCheck
    }
    if (!this.gl) {
      this.gl = canvas.getContext('webgl')!
    }
    const gl = this.gl!
    const k = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(k, fs)
    gl.compileShader(k)
    if (!gl.getShaderParameter(k, gl.COMPILE_STATUS)) {
      window.alert(gl.getShaderInfoLog(k))
    } else {
      GDStore.setCode(fs)
    }
  }

  repeat() {
    this.$nuxt.$emit('repeat', 0)
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

.button
  height 2rem
  background-color red

.e-check
  display none
</style>
