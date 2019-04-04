import { Type } from "./interfaces";

export enum HTTP_METHODS {
	GET    = "get",
	HEAD   = "head",
	POST   = "post",
	PUT    = "put",
	PATCH  = "patch",
	OPTIONS  = "options",
	DELETE = "delete",
}

export enum METADATA_KEYS {
	PARAMETER_TYPES = "design:paramtypes",
	RETURN_TYPE = "design:returntype",
	ACTION_PARAMS = "action:routeparams",
	// Etc...
}

export type ActionParameterInjectable = "number" | "string" | "boolean"

export type GenericPropertyDecorator<T> = (target: any, propertyKey: string) => T

export type GenericClassDecorator<T> = (target: Type<T>, key: string) => void

function requestHandlerFactory(req: any, res: any, next: any) {
	
}