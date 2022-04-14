import React, { useEffect, useRef, useState, VFC } from 'react';
import * as THREE from 'three';
import { css } from '@emotion/css';
import { works } from '../modules/data';
import { appState } from '../modules/store';

export const MouseTracker: VFC = () => {
	const ref = useRef<HTMLDivElement>(null)
	const animeID = useRef<number>()

	useEffect(() => {
		const tracker = new THREE.Vector2()
		const target = new THREE.Vector2()

		const handleMouseMove = (e: MouseEvent) => {
			target.set(e.clientX, e.clientY)
		}
		window.addEventListener('mousemove', handleMouseMove)

		const anime = () => {
			tracker.lerp(target, 0.1)
			ref.current!.style.setProperty('--x', tracker.x + 'px')
			ref.current!.style.setProperty('--y', tracker.y + 'px')

			if (!appState.enabledScroll) {
				// During scrolling animation
				ref.current!.classList.remove('active')
			} else if (appState.hoveredLink) {
				ref.current!.classList.add('active')
			} else {
				ref.current!.classList.remove('active')
			}

			animeID.current = requestAnimationFrame(anime)
		}
		anime()

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			animeID.current && cancelAnimationFrame(animeID.current)
		}
	}, [])

	return (
		<div ref={ref} className={styles.container}>
			<ThumbImage />
		</div>
	)
}

const ThumbImage: VFC = () => {
	const animeID = useRef<number>()
	const [fileName, setFileName] = useState(works[appState.workIndex].image)

	useEffect(() => {
		const anime = () => {
			if (appState.enabledScroll) {
				setFileName(works[appState.workIndex].image)
			}
			animeID.current = requestAnimationFrame(anime)
		}
		anime()

		return () => {
			animeID.current && cancelAnimationFrame(animeID.current)
		}
	}, [])

	return <img className={styles.image} src={`${process.env.PUBLIC_URL}/assets/images/${fileName}`} alt="" />
}

const styles = {
	container: css`
		position: absolute;
		top: var(--y);
		left: var(--x);
		width: 10px;
		height: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		border: 5px solid #fff;
		background-color: #fff;
		transform: translate(-50%, -50%);
		overflow: hidden;
		pointer-events: none;
		transition: width 0.5s, height 0.5s, border 0.5s;

		&.active {
			width: 200px;
			height: 200px;
			border: 2px solid #fff;
		}
	`,
	image: css`
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: cover;
	`
}
