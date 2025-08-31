import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { getMaxTexturesPerBatch } from '../../../batcher/gl/utils/maxRecommendedTextures.mjs';
import { UniformGroup } from '../../shared/shader/UniformGroup.mjs';
import { generateShaderSyncCode } from './GenerateShaderSyncCode.mjs';
import { generateProgram } from './program/generateProgram.mjs';

"use strict";
const WEBGL_TO_WEBGPU_UNIFORM_MAP = {
  float: "f32",
  int: "i32",
  vec2: "vec2<f32>",
  vec3: "vec3<f32>",
  vec4: "vec4<f32>",
  mat2: "mat2x2<f32>",
  mat3: "mat3x3<f32>",
  mat4: "mat4x4<f32>",
  // For types that don’t have a direct equivalent in WebGL, you can leave them unmapped or handle them separately.
  sampler2D: "sampler2D",
  samplerCube: "samplerCube",
  sampler2DArray: "sampler2DArray"
};
const defaultSyncData = {
  textureCount: 0,
  blockIndex: 0
};
class GlShaderSystem {
  constructor(renderer) {
    /**
     * @internal
     * @private
     */
    this._activeProgram = null;
    this._programDataHash = /* @__PURE__ */ Object.create(null);
    this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null);
    this._renderer = renderer;
    this._renderer.renderableGC.addManagedHash(this, "_programDataHash");
  }
  contextChange(gl) {
    this._gl = gl;
    this._programDataHash = /* @__PURE__ */ Object.create(null);
    this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null);
    this._activeProgram = null;
    this.maxTextures = getMaxTexturesPerBatch();
  }
  /**
   * Changes the current shader to the one given in parameter.
   * @param shader - the new shader
   * @param skipSync - false if the shader should automatically sync its uniforms.
   * @returns the glProgram that belongs to the shader.
   */
  bind(shader, skipSync) {
    this._setProgram(shader.glProgram);
    if (skipSync)
      return;
    defaultSyncData.textureCount = 0;
    defaultSyncData.blockIndex = 0;
    let syncFunction = this._shaderSyncFunctions[shader.glProgram._key];
    this.ensureUniformStructures(shader);
    if (!syncFunction) {
      syncFunction = this._shaderSyncFunctions[shader.glProgram._key] = this._generateShaderSync(shader, this);
    }
    this._renderer.buffer.nextBindBase(!!shader.glProgram.transformFeedbackVaryings);
    syncFunction(this._renderer, shader, defaultSyncData);
  }
  ensureUniformStructures(shader) {
    for (const i in shader.groups) {
      const group = shader.groups[i];
      for (const j in group.resources) {
        const resource = group.resources[j];
        if (resource instanceof UniformGroup) {
          this.bloop(resource, shader.glProgram);
        }
      }
    }
  }
  bloop(uniformGroup, glProgram) {
    const uniformData = glProgram._uniformData;
    const uniformStructures = uniformGroup.uniformStructures;
    for (const i in uniformGroup.uniforms) {
      const uniformValue = uniformGroup.uniforms[i];
      if (uniformValue instanceof UniformGroup) {
        uniformStructures[i] || (uniformStructures[i] = {
          value: uniformValue,
          type: "uniformGroup",
          name: i
        });
        this.bloop(uniformValue, glProgram);
      } else if (uniformData[i]) {
        uniformStructures[i] || (uniformStructures[i] = {
          value: uniformValue,
          type: WEBGL_TO_WEBGPU_UNIFORM_MAP[uniformData[i].type],
          name: i,
          size: 1
        });
      }
    }
  }
  /**
   * Updates the uniform group.
   * @param uniformGroup - the uniform group to update
   */
  updateUniformGroup(uniformGroup) {
    this._renderer.uniformGroup.updateUniformGroup(uniformGroup, this._activeProgram, defaultSyncData);
  }
  /**
   * Binds a uniform block to the shader.
   * @param uniformGroup - the uniform group to bind
   * @param name - the name of the uniform block
   * @param index - the index of the uniform block
   */
  bindUniformBlock(uniformGroup, name, index = 0) {
    const bufferSystem = this._renderer.buffer;
    const programData = this._getProgramData(this._activeProgram);
    const isBufferResource = uniformGroup._bufferResource;
    if (!isBufferResource) {
      this._renderer.ubo.updateUniformGroup(uniformGroup);
    }
    const buffer = uniformGroup.buffer;
    const glBuffer = bufferSystem.updateBuffer(buffer);
    const boundLocation = bufferSystem.freeLocationForBufferBase(glBuffer);
    if (isBufferResource) {
      const { offset, size } = uniformGroup;
      if (offset === 0 && size === buffer.data.byteLength) {
        bufferSystem.bindBufferBase(glBuffer, boundLocation);
      } else {
        bufferSystem.bindBufferRange(glBuffer, boundLocation, offset);
      }
    } else if (bufferSystem.getLastBindBaseLocation(glBuffer) !== boundLocation) {
      bufferSystem.bindBufferBase(glBuffer, boundLocation);
    }
    const uniformBlockIndex = this._activeProgram._uniformBlockData[name].index;
    if (programData.uniformBlockBindings[index] === boundLocation)
      return;
    programData.uniformBlockBindings[index] = boundLocation;
    this._renderer.gl.uniformBlockBinding(programData.program, uniformBlockIndex, boundLocation);
  }
  _setProgram(program) {
    if (this._activeProgram === program)
      return;
    this._activeProgram = program;
    const programData = this._getProgramData(program);
    this._gl.useProgram(programData.program);
  }
  /**
   * @param program - the program to get the data for
   * @internal
   * @private
   */
  _getProgramData(program) {
    return this._programDataHash[program._key] || this._createProgramData(program);
  }
  _createProgramData(program) {
    const key = program._key;
    this._programDataHash[key] = generateProgram(this._gl, program);
    return this._programDataHash[key];
  }
  destroy() {
    for (const key of Object.keys(this._programDataHash)) {
      const programData = this._programDataHash[key];
      programData.destroy();
      this._programDataHash[key] = null;
    }
    this._programDataHash = null;
  }
  /**
   * Creates a function that can be executed that will sync the shader as efficiently as possible.
   * Overridden by the unsafe eval package if you don't want eval used in your project.
   * @param shader - the shader to generate the sync function for
   * @param shaderSystem - the shader system to use
   * @returns - the generated sync function
   * @ignore
   */
  _generateShaderSync(shader, shaderSystem) {
    return generateShaderSyncCode(shader, shaderSystem);
  }
  resetState() {
    this._activeProgram = null;
  }
}
/** @ignore */
GlShaderSystem.extension = {
  type: [
    ExtensionType.WebGLSystem
  ],
  name: "shader"
};

export { GlShaderSystem, WEBGL_TO_WEBGPU_UNIFORM_MAP };
//# sourceMappingURL=GlShaderSystem.mjs.map
