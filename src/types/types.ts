export type Work = {
	title: string
	url: string
	date: string
	technology: string
	image: string
}

export type AppState = {
	progress: number
	progress2: number
	rtProgress: () => number
	transition: 'next' | 'prev'
	enabledTransition: boolean
	enabledScroll: boolean
	workIndex: number
	getNextWorkIndex: () => number
	getPrevWorkIndex: () => number
	calcWorkIndex: (dir: 'next' | 'prev') => void
	hoveredLink: boolean
	pageTransitionProgress: number
}
