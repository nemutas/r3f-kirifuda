import React, { Suspense, VFC } from 'react';
import { Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { CameraAnimation } from './CameraAnimation';
import { MainCard } from './MainCard';
import { Effects } from './postprocessing/Effects';
import { RippleDistortionPass } from './postprocessing/RippleDistortionPass';
import { SwellPass } from './postprocessing/SwellPass';
import { ProgressManager } from './ProgressManager';
import { SubCards } from './SubCards';

export const TCanvas: VFC = () => {
	return (
		<Canvas
			camera={{
				position: [0, 0, 3],
				fov: 50,
				aspect: window.innerWidth / window.innerHeight,
				near: 0.1,
				far: 2000
			}}
			dpr={window.devicePixelRatio}
			shadows>
			<color attach="background" args={['#000']} />
			<Suspense fallback={null}>
				<SubCards />
				<MainCard />
				<Effects sRGBCorrection>
					{/* <FlowmapPass /> */}
					<SwellPass />
					<RippleDistortionPass />
				</Effects>
				<ProgressManager />
				<CameraAnimation />
				{/* <Stats /> */}
			</Suspense>
		</Canvas>
	)
}
