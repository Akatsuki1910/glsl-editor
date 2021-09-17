<template lang="pug">
  div.canvas(ref="can")
</template>

<script lang="ts">
import * as THREE from 'three'
import { Component, Ref, Vue, Watch } from 'nuxt-property-decorator'
import vertexShader from './glsl/shader/shader.vert'
import { GDStore } from '@/store'
@Component({})
export default class Editor extends Vue {
  @Ref() can!: HTMLCanvasElement

  count: number = 0
  uniforms!: {
    time: { type: string; value: number }
    resolution: { type: string; value: THREE.Vector2 }
  }

  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
  camera: THREE.Camera = new THREE.Camera()
  scene: THREE.Scene = new THREE.Scene()
  fragmentShader!: string
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | undefined

  // computed()
  get glsldata() {
    return GDStore.code
  }

  // created()
  created() {
    this.$nuxt.$on('repeat', (data: number) => {
      this.count = data
    })
  }

  beforeDestroy() {
    this.$nuxt.$off('repeat')
  }

  // watch()
  @Watch('glsldata')
  compileGLSL(data: string) {
    this.fragmentShader = data
    if (this.mesh !== undefined) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.material.dispose()
      this.mesh = undefined
    }
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader: this.fragmentShader,
    })
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    this.scene.add(this.mesh)
    this.count = 0
  }

  // mounted()
  mounted() {
    this.camera.position.z = 1

    this.uniforms = {
      time: { type: 'f', value: 1.0 },
      resolution: { type: 'v2', value: new THREE.Vector2() },
    }

    this.renderer.setPixelRatio(
      window.devicePixelRatio ? window.devicePixelRatio : 1,
    )
    this.can.appendChild(this.renderer.domElement)

    this.setSize()

    window.onresize = () => {
      this.setSize()
    }

    this.animation()
  }

  // methods()
  setSize() {
    this.uniforms.resolution.value.x = window.innerWidth / 2
    this.uniforms.resolution.value.y = window.innerHeight
    this.renderer.setSize(
      this.uniforms.resolution.value.x,
      this.uniforms.resolution.value.y,
    )
  }

  animation() {
    requestAnimationFrame(this.animation)
    this.uniforms.time.value = this.count / 60
    this.renderer.render(this.scene, this.camera)
    this.count++
  }
}
</script>

<style lang="scss" scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
