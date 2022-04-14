import GUI from 'lil-gui';

export class GUIController {
	private static _instance: GUIController | null
	private _gui
	private _currentFolderName: string | undefined

	private constructor() {
		this._gui = new GUI()
	}

	static get instance() {
		if (!this._instance) {
			this._instance = new GUIController()
		}
		this._instance._currentFolderName = undefined
		return this._instance
	}

	private _getGui = (folderName: string | undefined) => {
		let gui = this._gui
		if (folderName) {
			gui = this._folder(folderName)
		} else if (this._currentFolderName) {
			gui = this._folder(this._currentFolderName)
		}
		return gui
	}

	private _folder = (title: string) => {
		let folder = this._gui.folders.find(f => f._title === title)
		if (!folder) folder = this._gui.addFolder(title)
		return folder
	}

	private _controller = (gui: GUI, name: string) => {
		return gui.controllers.find(c => c._name === name)
	}

	setFolder = (name: string) => {
		this._currentFolderName = name
		return this
	}

	open = (open: boolean) => {
		this._getGui(this._currentFolderName).open(open)
		return this
	}

	/**
	 * add color controls
	 * @reference https://lil-gui.georgealways.com/#Guide#Colors
	 */
	addColor = (
		obj: object,
		propertyName: string,
		rgbScale?: number | undefined,
		displayName?: string | undefined,
		folderName?: string | undefined
	) => {
		const controllerName = displayName ? displayName : propertyName
		const gui = this._getGui(folderName)

		let controller = this._controller(gui, controllerName)
		if (!controller) {
			controller = gui.addColor(obj, propertyName, rgbScale).name(controllerName)
		}
		return controller
	}

	/**
	 * add numeric slider controls
	 * @reference https://lil-gui.georgealways.com/#Guide#Numbers-and-Sliders
	 */
	addNumericSlider = (
		obj: object,
		propertyName: string,
		min: number,
		max: number,
		step: number,
		displayName?: string | undefined,
		folderName?: string | undefined
	) => {
		const controllerName = displayName ? displayName : propertyName
		const gui = this._getGui(folderName)

		let controller = this._controller(gui, controllerName)
		if (!controller) {
			controller = gui.add(obj, propertyName, min, max, step).name(controllerName)
		}
		return controller
	}

	/**
	 * add dropdown controls
	 * @reference https://lil-gui.georgealways.com/#Guide#Dropdowns
	 */
	addDropdown = (
		obj: object,
		propertyName: string,
		list: string[] | { [key: string]: number },
		displayName?: string | undefined,
		folderName?: string | undefined
	) => {
		const controllerName = displayName ? displayName : propertyName
		const gui = this._getGui(folderName)

		let controller = this._controller(gui, controllerName)
		if (!controller) {
			controller = gui.add(obj, propertyName, list).name(controllerName)
		}
		return controller
	}

	/**
	 * add Button controls
	 * @description property given by its property name is a callback method.
	 * @reference https://lil-gui.georgealways.com/#Guide#Saving
	 */
	addButton = (
		obj: object,
		propertyName: string,
		displayName?: string | undefined,
		folderName?: string | undefined
	) => {
		const controllerName = displayName ? displayName : propertyName
		const gui = this._getGui(folderName)

		let controller = this._controller(gui, controllerName)
		if (!controller) {
			controller = gui.add(obj, propertyName).name(controllerName)
		}
		return controller
	}

	/**
	 * add CheckBox controls
	 * @description property given by its property name is type of boolean.
	 * @reference https://lil-gui.georgealways.com/#Guide#Adding-Controllers
	 */
	addCheckBox = (
		obj: object,
		propertyName: string,
		displayName?: string | undefined,
		folderName?: string | undefined
	) => {
		const controllerName = displayName ? displayName : propertyName
		const gui = this._getGui(folderName)

		let controller = this._controller(gui, controllerName)
		if (!controller) {
			controller = gui.add(obj, propertyName).name(controllerName)
		}
		return controller
	}
}
