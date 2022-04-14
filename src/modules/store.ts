import { proxy } from 'valtio';
import { AppState } from '../types/types';
import { works } from './data';

export const appState: AppState = {
	progress: 0,
	progress2: 0,
	/** round trip */
	rtProgress: () => {
		let p = appState.progress // 0 ~ 1
		p *= 2 // 0 ~ 2
		p -= 1 // -1 ~ 1
		p = 1 - Math.abs(p) // 0 ~ 1 ~ 0
		return p
	},

	transition: 'next',
	enabledTransition: false,
	enabledScroll: true,

	workIndex: 0,
	getNextWorkIndex: () => (appState.workIndex < works.length - 1 ? appState.workIndex + 1 : 0),
	getPrevWorkIndex: () => (0 < appState.workIndex ? appState.workIndex - 1 : works.length - 1),
	calcWorkIndex: dir => {
		appState.workIndex = dir === 'next' ? appState.getNextWorkIndex() : appState.getPrevWorkIndex()
	},

	hoveredLink: false,
	pageTransitionProgress: 0
}

export const loadingState = proxy<{ completed: boolean }>({ completed: false })
