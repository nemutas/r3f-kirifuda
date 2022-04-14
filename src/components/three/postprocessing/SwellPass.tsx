import { useRef, VFC } from 'react';
import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { useFrame } from '@react-three/fiber';
import { appState } from '../../../modules/store';

export const SwellPass: VFC = () => {
	const passRef = useRef<ShaderPass>(null)

	const shader: THREE.Shader = {
		uniforms: {
			tDiffuse: { value: null },
			u_progress: { value: appState.rtProgress() }
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	}

	useFrame(() => {
		passRef.current!.uniforms.u_progress.value = appState.rtProgress()
	})

	return <shaderPass ref={passRef} attachArray="passes" args={[shader]} />
}

const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform sampler2D tDiffuse;
uniform float u_progress;
varying vec2 v_uv;

void main() {
  vec2 u = v_uv * 2.0 - 1.0;
  float dist = distance(v_uv, vec2(0.5));
  dist = 1.0 - dist;
	vec2 offset = u * dist * vec2(0.35, 0.35) * u_progress;
  vec2 uv = v_uv - offset;
  vec4 tex = texture2D(tDiffuse, uv);
  
  gl_FragColor = tex;
}
`
