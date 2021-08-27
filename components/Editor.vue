<template lang="pug">
  div.editor-wrap
    .edi
      Ace(ref='shader')
      Ace(ref='sound')
    .button
      button.btn(@click='compile') compile
      button.btn(@click='repeat') repeat
      button.btn(@click='mcompile') mcompile
      button.btn(:disabled="!mFlag" @click='start') start
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import { GDStore } from '@/store'
import Ace from './Ace.vue'
import Music from './music'
import fragmentShader from './glsl/shader/shader.frag'
import shaderdefinitionShader from './glsl/shader/shaderdefinition.frag'
import soundShader from './glsl/sound/sound.frag'
import soundmainShader from './glsl/sound/soundmain.frag'
import sounddefinitionShader from './glsl/sound/sounddefinition.frag'
@Component({})
export default class Editor extends Vue {
  @Ref() shader!: Ace
  @Ref() sound!: Ace
  @Ref() eCheck!: HTMLCanvasElement

  gl: WebGLRenderingContext | null = null
  music = new Music()
  mFlag = false

  // mounted()
  mounted() {
    this.shader.setValue(fragmentShader)
    this.sound.setValue(soundShader)
    this.compile()
  }

  // methods()
  mcompile() {
    const ss =
      sounddefinitionShader + this.sound.editor.getValue() + soundmainShader
    this.mFlag = this.compileCheck(ss)
    if (this.mFlag) {
      this.music.setFrag(ss)
    }
  }
  start() {
    this.music.pp()
  }
  compile() {
    const fs = shaderdefinitionShader + this.shader.editor.getValue()
    const fFlag = this.compileCheck(fs)
    if (fFlag) {
      GDStore.setCode(fs)
    }
  }

  compileCheck(s: string) {
    let rFrag = false
    let canvas: HTMLCanvasElement = document.createElement('canvas')
    if (!this.gl) {
      this.gl = canvas.getContext('webgl')!
    }
    const gl = this.gl!
    const k = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(k, s)
    gl.compileShader(k)
    if (!gl.getShaderParameter(k, gl.COMPILE_STATUS)) {
      window.alert(gl.getShaderInfoLog(k))
    } else {
      rFrag = true
    }

    return rFrag
  }

  repeat() {
    this.$nuxt.$emit('repeat', 0)
  }
}
</script>

<style lang="stylus" scoped>
.edi
  width 50vw
  height calc(100vh - 2rem)
  display flex
  flex-direction column

.button
  height 2rem
  background-color red
</style>
