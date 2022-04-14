import React, { VFC } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { appState } from '../../modules/store';

export const CameraAnimation: VFC = () => {
	const target = new THREE.Vector3()
	return useFrame(({ camera }) => {
		target.copy(camera.position)
		const dir = appState.transition === 'next' ? -1 : 1
		target.y = dir * appState.rtProgress()
		camera.position.lerp(target, 0.05)
	})
}
