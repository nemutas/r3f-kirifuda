import gsap from 'gsap';
import { VFC } from 'react';
import { useFrame } from '@react-three/fiber';
import { appState } from '../../modules/store';

export const ProgressManager: VFC = () => {
	const anime = () => {
		const tl = gsap.timeline({
			onComplete: () => {
				appState.enabledScroll = true
			}
		})
		appState.progress = 1
		appState.progress2 = 1
		tl.to(appState, { progress: 0, duration: 1, ease: 'power1.inOut' })
		tl.to(appState, { progress2: 0, duration: 0.3, ease: 'none' })
	}

	return useFrame(() => {
		if (appState.enabledTransition) {
			anime()
			appState.enabledTransition = false
		}
	})
}
