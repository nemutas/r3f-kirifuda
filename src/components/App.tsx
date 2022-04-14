import React, { VFC } from 'react';
import { useSnapshot } from 'valtio';
import { css } from '@emotion/css';
import { appState, loadingState } from '../modules/store';
import { LinkIconButton } from './LinkIconButton';
import { Loading } from './Loading';
import { MouseTracker } from './MouseTracker';
import { ScrollAnotation } from './ScrollAnotation';
import { TCanvas } from './three/TCanvas';

export const App: VFC = () => {
	const loadingSnap = useSnapshot(loadingState)

	const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
		if (appState.enabledScroll && loadingSnap.completed) {
			appState.enabledTransition = true
			appState.enabledScroll = false

			if (0 < e.deltaY) {
				appState.transition = 'next'
				appState.calcWorkIndex('next')
			} else {
				appState.transition = 'prev'
				appState.calcWorkIndex('prev')
			}
		}
	}

	return (
		<div className={styles.container} onWheel={handleWheel}>
			<TCanvas />
			<LinkIconButton imagePath="/assets/icons/github.svg" linkPath="https://github.com/nemutas/r3f-kirifuda" />
			<MouseTracker />
			<ScrollAnotation />
			<Loading />
		</div>
	)
}

const styles = {
	container: css`
		position: relative;
		width: 100vw;
		height: 100vh;
	`
}
