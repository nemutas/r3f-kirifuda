import * as THREE from 'three';
import { works } from '../../modules/data';
import { appState } from '../../modules/store';
import { Work } from '../../types/types';

export class DetailDrawer {
	private _canvas
	private _ctx
	private _texture
	private _charSet

	private _marginLeft = 50
	private _mainFontSize = 40
	private _subFontSize = 25

	private _work: Work | null = null

	constructor() {
		const canvas = document.createElement('canvas')
		canvas.width = 512 * 0.8
		canvas.height = 512
		this._canvas = canvas
		this._ctx = canvas.getContext('2d')!
		this._charSet = this._createCharSet()
		this._texture = new THREE.CanvasTexture(this._canvas)
		this._texture.encoding = THREE.sRGBEncoding
	}

	private _createCharSet = () => {
		const charArray: string[] = []
		// alphabet
		;[...Array(26)].forEach((_, i) => charArray.push(String.fromCharCode('a'.charCodeAt(0) + i)))
		const upper = charArray.map(c => c.toUpperCase())
		charArray.push(...upper)
		// number
		;[...Array(10)].forEach((_, i) => charArray.push(i.toString()))
		// symbol
		charArray.push('!', '#', '$', '%', '&', '*', '+', ',', '-', '.', '/')
		// console.log(charArray)
		return charArray
	}

	get texture() {
		return this._texture
	}

	get aspect() {
		return this._canvas.width / this._canvas.height
	}

	set work(w: Work) {
		this._work = w
	}

	private _getRandomString = (count: number) => {
		let result = ''
		for (let i = 0; i < count; i++) {
			result += this._charSet[Math.floor(Math.random() * this._charSet.length)]
		}
		return result
	}

	private _drawMainText = (text: string, y: number) => {
		this._ctx.font = `bold ${this._mainFontSize}px 'Poppins'`
		this._ctx.fillStyle = '#fff'
		this._ctx.fillText(text, this._marginLeft, y)
		return y + this._mainFontSize * 2.5
	}

	private _drawSubText = (text: string, y: number) => {
		this._ctx.font = `bold ${this._subFontSize}px 'Poppins'`
		this._ctx.fillStyle = '#999'
		this._ctx.fillText(text, this._marginLeft, y)
		return y + this._subFontSize + this._subFontSize / 1.5
	}

	private _drawMainRect = (y: number, progress: number, scale = 1) => {
		this._ctx.fillStyle = '#fff'
		this._ctx.fillRect(
			-this._ctx.canvas.width * scale + this._ctx.canvas.width * 2 * scale * (1 - progress),
			y,
			this._ctx.canvas.width,
			this._mainFontSize + 5
		)
	}

	private _drawSubRect = (y: number, progress: number, scale = 1) => {
		this._ctx.fillStyle = '#000'
		this._ctx.fillRect(
			this._ctx.canvas.width * scale * (1 - progress),
			y,
			this._ctx.canvas.width,
			this._subFontSize + 5
		)
	}

	draw = (progress: number, progress2: number) => {
		if (!this._work) return

		const ctx = this._ctx
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		ctx.textAlign = 'left'
		ctx.textBaseline = 'hanging'

		let y = 0
		let text = ''

		y = this._drawSubText('Works No.', y)
		this._drawMainRect(y, progress, 3)
		const workNo = `${appState.workIndex + 1} / ${works.length}`
		text = progress === 0 ? workNo : this._getRandomString(workNo.length)
		y = this._drawMainText(text, y)

		y = this._drawSubText('Production date', y)
		this._drawMainRect(y, progress, 2)
		const date = this._work.date.split('.').join('. ')
		text = progress === 0 ? date : this._getRandomString(date.length)
		y = this._drawMainText(text, y)

		y = this._drawSubText('Technology', y)
		this._drawMainRect(y, progress, 1)
		text = progress === 0 ? this._work.technology : this._getRandomString(this._work.technology.length)
		y = this._drawMainText(text, y)

		let prevY = y
		y = this._drawSubText('To see more about this work,', y)
		this._drawSubRect(prevY, progress2, 2)
		prevY = y
		this._drawSubText('press the text on the right.', y)
		this._drawSubRect(prevY, progress2, 1)

		ctx.lineWidth = 3
		ctx.strokeStyle = '#999'
		ctx.beginPath()
		ctx.moveTo(0, 0)
		ctx.lineTo(0, ctx.canvas.height * (1 - progress2))
		ctx.stroke()
	}
}
