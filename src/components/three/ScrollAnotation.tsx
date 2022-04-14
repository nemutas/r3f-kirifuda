import React, { VFC } from 'react';
import { css, keyframes } from '@emotion/css';

export const ScrollAnotation: VFC = () => {
	return (
		<div className={styles.container}>
			<div className={styles.text}>SCROLL</div>
			<div className={styles.bar} />
		</div>
	)
}

const animation = {
	bar: keyframes`
    0% {
      width: 0%;
    }
    100% {
      width: 200%;
    }
  `
}

const styles = {
	container: css`
		position: absolute;
		bottom: 10px;
		left: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		grid-gap: 10px;
		transform-origin: center left;
		transform: rotateZ(90deg) translate(-130px, -21px);
		user-select: none;
	`,
	text: css`
		color: #fff;
		font-size: 1.1rem;
	`,
	bar: css`
		position: relative;
		width: 80px;
		height: 1px;
		background-color: #555;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			width: 0%;
			height: 1px;
			background-color: #fff;
			animation: ${animation.bar} 2s linear infinite;
		}
	`
}
