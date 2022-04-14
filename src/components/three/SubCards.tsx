import { useMemo, useRef, VFC } from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { works } from '../../modules/data';
import { cnoise21 } from '../../modules/glsl';
import { appState } from '../../modules/store';
import { DetailDrawer } from './detailDrawer';

export const SubCards: VFC = () => {
	const groupRef = useRef<THREE.Group>(null)
	const lowerRef = useRef<THREE.Mesh>(null)
	const upperRef = useRef<THREE.Mesh>(null)

	const drawer = new DetailDrawer()

	const scale = 1.0

	const { positions, toCenter, bounding } = useMemo(() => {
		const positions: THREE.Vector3[] = []
		const [marginX, marginY] = [0.15, 0.15]
		const [amountX, amountY] = [10, 10]
		for (let xi = 0; xi < amountX; xi++) {
			for (let yi = 0; yi < amountY; yi++) {
				positions.push(new THREE.Vector3(xi * drawer.aspect + xi * marginX, yi + yi * marginY, 0))
			}
		}

		const toCenter = new THREE.Vector2(
			-((amountX - 1) * drawer.aspect + (amountX - 1) * marginX) / 2,
			-(amountY - 1 + (amountY - 1) * marginY) / 2
		)

		const bounding = new THREE.Vector2(drawer.aspect + marginX, 1 + marginY).multiplyScalar(scale)
		return { positions, toCenter, bounding }
	}, [drawer.aspect])

	const material = new THREE.ShaderMaterial({
		uniforms: {
			u_texture: { value: drawer.texture },
			u_progress: { value: 0 },
			u_time: { value: 0 }
		},
		vertexShader,
		fragmentShader,
		transparent: true
	})

	const substanceMaterial = material.clone()
	substanceMaterial.fragmentShader = fragmentShader2

	useFrame(() => {
		drawer.work = works[appState.workIndex]
		drawer.draw(appState.progress, appState.progress2)
		drawer.texture.needsUpdate = true

		material.uniforms.u_time.value += 0.005
		material.uniforms.u_progress.value = appState.progress

		const dir = appState.transition === 'next' ? 1 : -1
		groupRef.current!.position.y = appState.progress === 0 ? 0 : dir * bounding.y * 2 * (1 - appState.progress)
		groupRef.current!.position.z = -appState.rtProgress() * 1.8

		lowerRef.current!.visible = 0 < appState.progress
		upperRef.current!.visible = 0 < appState.progress
	})

	const currentCardIndex = 35

	return (
		<group ref={groupRef}>
			<group scale={scale} position={[toCenter.x, toCenter.y - 0.3, 0]}>
				{positions.map((position, i) => {
					return i === currentCardIndex ? (
						// current
						<Plane key={i} material={substanceMaterial} args={[drawer.aspect, 1]} position={position} />
					) : i === currentCardIndex - 2 ? (
						// 2 lower
						<Plane key={i} ref={lowerRef} material={substanceMaterial} args={[drawer.aspect, 1]} position={position} />
					) : i === currentCardIndex + 2 ? (
						// 2 upper
						<Plane key={i} ref={upperRef} material={substanceMaterial} args={[drawer.aspect, 1]} position={position} />
					) : (
						// another
						<Plane key={i} material={material} args={[drawer.aspect, 1]} position={position} />
					)
				})}
			</group>
		</group>
	)
}

const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform sampler2D u_texture;
uniform float u_progress;
uniform float u_time;

varying vec2 v_uv;

${cnoise21}

void main() {
  vec4 tex = texture2D(u_texture, v_uv);

  vec2 seed = v_uv * vec2(3.0, 5.0) * (u_progress + 0.2);
  float n = cnoise21(seed);
  n = smoothstep(0.0, 0.0 + 0.01, n);
  n *= pow(u_progress, 0.7);
  tex.rgb *= n;

  gl_FragColor = tex;
  // gl_FragColor = vec4(vec3(n), 1.0);
}
`

const fragmentShader2 = `
uniform sampler2D u_texture;
varying vec2 v_uv;

void main() {
  vec4 tex = texture2D(u_texture, v_uv);

  gl_FragColor = tex;
}
`
