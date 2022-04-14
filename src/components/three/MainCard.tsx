import gsap from 'gsap';
import React, { useCallback, useRef, VFC } from 'react';
import * as THREE from 'three';
import { Plane, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { works } from '../../modules/data';
import { random11 } from '../../modules/glsl';
import { appState } from '../../modules/store';

export const MainCard: VFC = () => {
	const groupRef = useRef<THREE.Group>(null)

	const textImages = works.map(work => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const texture = useTexture(process.env.PUBLIC_URL + `/assets/textImages/${work.image}`)
		texture.encoding = THREE.sRGBEncoding
		return texture
	})

	useFrame(() => {
		const dir = appState.transition === 'next' ? 1 : -1
		groupRef.current!.position.y = appState.progress === 0 ? 0 : dir * 1.8 * 2 * (1 - appState.progress)
		groupRef.current!.position.z = appState.rtProgress() * 0.3
	})

	return (
		<group ref={groupRef} scale={[1.8, 1.8, 1]} position-x={0.5}>
			<Card type="prev" y={2} textImages={textImages} />
			<Card type="current" y={0} textImages={textImages} />
			<Card type="next" y={-2} textImages={textImages} />
		</group>
	)
}

// ========================================================
type CardProps = {
	type: 'current' | 'next' | 'prev'
	y: number
	textImages: THREE.Texture[]
}

const Card: VFC<CardProps> = ({ type, y, textImages }) => {
	let pageTransition = false

	const getWorkIndex = useCallback(
		() =>
			type === 'current'
				? appState.workIndex
				: type === 'next'
				? appState.getNextWorkIndex()
				: appState.getPrevWorkIndex(),
		[type]
	)

	// -------------------------------
	// create shaders
	const shader: THREE.Shader = {
		uniforms: {
			u_texture: { value: textImages[getWorkIndex()] },
			u_time: { value: 0 },
			u_hover: { value: false }
		},
		vertexShader,
		fragmentShader
	}

	// -------------------------------
	// frame loop
	let prevProgress = 0
	useFrame(() => {
		shader.uniforms.u_time.value += 0.005

		if (appState.progress === 0 && 0 < prevProgress) {
			// Runs only once when the animation is over.
			shader.uniforms.u_texture.value = textImages[getWorkIndex()]
		}

		prevProgress = appState.progress
	})

	// -------------------------------
	// events
	const hadlePointerEnter = () => {
		shader.uniforms.u_hover.value = true
		!pageTransition && (appState.hoveredLink = true)
	}

	const handlePointerLeave = () => {
		shader.uniforms.u_hover.value = false
		!pageTransition && (appState.hoveredLink = false)
	}

	const handleClick = () => {
		if (appState.enabledScroll) {
			// Scrolling is enabled. In other words, not in scrolling animation.
			pageTransition = true
			appState.hoveredLink = false

			const tl = gsap.timeline()
			tl.to(appState, { pageTransitionProgress: 1, duration: 0.8, ease: 'power1.in' })
			tl.to(appState, {
				pageTransitionProgress: 1,
				duration: 0.2,
				ease: 'none',
				onComplete: () => {
					window.open(works[appState.workIndex].url, '_blank', 'noopener noreferrer')
					appState.pageTransitionProgress = 0
					pageTransition = false
				}
			})
		}
	}

	return (
		<Plane
			args={[1.3, 1]}
			position-y={y}
			onPointerEnter={hadlePointerEnter}
			onPointerLeave={handlePointerLeave}
			onClick={handleClick}>
			<shaderMaterial args={[shader]} transparent />
		</Plane>
	)
}

// --------------------------------------------------------
const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform sampler2D u_texture;
uniform float u_time;
uniform bool u_hover;
varying vec2 v_uv;

${random11}

void main() {
  vec2 uv = v_uv;
  if(u_hover) {
    uv.x += sin(uv.y * 2000.0 * random11(u_time)) * 0.005;
  }
  vec4 tex = texture2D(u_texture, uv);

  gl_FragColor = tex;
}
`
