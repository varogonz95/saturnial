import { Controller } from "./Controller";
import { Type, IClassContainer } from "./interfaces";

export class ControllerContainer implements IClassContainer<Controller> {
	
	protected items: {[name: string]: Type<Controller>}
	
	constructor() {
		this.items = { }
	}

	register(...items: Type<Controller>[]): void {
		items.forEach(item => {
			this.items[item.name] = item
		});
	}
	get(name: string): Type<Controller> {
		if (this.items[name] !== undefined)
			return this.items[name]
		throw Error(`[${name}] not found.`);
	}
}

export class AppContainer {
	
	private static instance: AppContainer = null

	private constructor(private controllerContainer: ControllerContainer) { }

	public controller(): ControllerContainer
	public controller(controllers: Type<Controller>[]): AppContainer
	public controller(controllers?: Type<Controller>[]): AppContainer | ControllerContainer {
		if (typeof controllers === "undefined")
			return this.controllerContainer

		this.controllerContainer.register(...controllers)
		return this
	}

	public static create(controllerContainer: ControllerContainer): AppContainer {
		if (this.instance === null)
			return this.instance = new AppContainer(controllerContainer)

		throw Error("There is already an instance of [AppContainer].");
	}

	public static getInstance(): AppContainer {
		return this.instance
	}

	/* public service(...services: Type<Service>[]) {
		this.controllerContainer.register(...controllers)
		return this
	} */
}

/* export class Container {

	private _container: InversifyContainer

	constructor(options?: interfaces.ContainerOptions) {
		this._container = new InversifyContainer(options)
	}

	public bind<T>(serviceIdentifier: string | symbol | interfaces.Newable<T> | interfaces.Abstract<T>): interfaces.BindingToSyntax<T> {
		return this._container.bind<T>(serviceIdentifier)
	}

	public get<T>(type: Type<T> | string): T {
		return this._container.get<T>(type)
	}

	public register(colelction: any): Container {
		switch (typeof param) {
			// Type<Controller> type
			case "function":
				console.log('Registering one instance')
				this._container.bind<any>(param.name.replace('Controller', '')).to(param)
				break;
		
			// IProviderCollection type
			case "object":
			if (param instanceof Array) {
					console.log('Registering variable length instances')
					param.forEach(controller => {
						this._container.bind<any>(controller.name.replace('Controller', '')).to(controller)
					});
				}

				else {
					console.log('Registering a collection')
					// Check for [controllers] property
					param.controllers.forEach((controller: Type<Controller>) => {
						this._container.bind<any>(controller.name.replace('Controller', '')).to(controller)
					});
	
					// Check for [controllersAs] property
					if (param.controllersAs !== undefined)
						for (const key in param.controllersAs)
							this._container.bind<any>(key).to(param.controllersAs[key])
				}
				break;
		}

		return this
	}

	public register(...controllers: Type<Controller>[]): void {
		controllers.forEach(controller => {
			this._container.bind<any>(controller.name.replace('Controller', '')).to(controller)
		});
	}

	public unregister(type: Type<Controller>): void
	public unregister(types: Type<Controller>[]): void
	public unregister(type_s: Type<Controller> | Type<Controller>[]): void {
		if (!Array.isArray(type_s))
			this._container.unbind(type_s)
		else
			(<Type<Controller>[]> type_s)
				.forEach(injectable => this._container.unbind(injectable))
	}

	public unregisterAll() {
		this._container.unbindAll()
	}
}

export class AppContainer {
	private controllerContainer: Container
	private serviceContainer: Container
	private static instance: AppContainer

	private constructor() {
		this.controllerContainer = new Container()
		this.serviceContainer = new Container({ defaultScope: "Singleton" })
	}

	public static getInstance(): AppContainer {
		return this.instance === undefined ?
			this.instance = new AppContainer() :
			this.instance
	}

	public setControllerContainer(container: Container): void {
		this.controllerContainer = container
	}

	public controller(): Container {
		return this.controllerContainer
	}

	public setServiceContainer(container: Container): void {
		this.serviceContainer = container
	}

	public service(): Container {
		return this.serviceContainer
	}
} */