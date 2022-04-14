import React, { useEffect, VFC } from 'react';
import { loadingState } from '../../modules/store';

export const Loading: VFC = () => {
	useEffect(() => {
		return () => {
			loadingState.completed = true
		}
	}, [])

	return null
}
