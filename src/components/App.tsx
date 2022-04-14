import React, { VFC } from 'react';
import { css } from '@emotion/css';
import { appState } from '../modules/store';
import { LinkIconButton } from './LinkIconButton';
import { MouseTracker } from './MouseTracker';
import { ScrollAnotation } from './ScrollAnotation';
import { TCanvas } from './three/TCanvas';

export const App: VFC = () => {
	const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
		if (appState.enabledScroll) {
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
