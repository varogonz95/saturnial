import { Controller } from "./Controller";
import { HTTP_METHODS } from "./Utils";
import { CorsOptionsDelegate, CorsOptions } from "cors";
import { ServeStaticOptions } from "serve-static";
import { CookieOptions } from "csurf";
import express from "express";

export interface ActionBindingOptions { params?: string }

export interface AppConfig {
	name?: string,
	url?: string,
	base?: string,
}

export interface ConfigOptions {
	app: AppConfig,
	server: ServerConfig,
	secret?: string,
}

export interface CSRFOptions {
	value?: (req: express.Request) => string,
	cookie?: boolean | CookieOptions,
	ignoreMethods?: string[],
	sessionKey?: string
}

interface ExtendOptions {
	ignoreDuplicates?: boolean
	ignoreNulls?: boolean
	ignoreEmpty?: boolean
}

export interface IClassContainer<T> {
	register(...items: Type<T>[]): void
	get(name: string): Type<T>
}

export interface IProviderCollection {
	controllers: Type<Controller>[],
	controllersAs?: { [key: string]: Type<Controller> }
	// services: Type<Service>[]
}

export interface IRoute {
	alias?: string,
	path: string,
	method: HTTP_METHODS,
	handler: string | Function,
	action: string
}

export interface ServerConfig {
	port: number,
	host?: string,
	static?: string
}

export interface ServerMiddlewareConfig {
    cors: boolean | CorsOptions | CorsOptionsDelegate,
    /**
     * TODO: begin
     * * CSRF protection with cookie-parser, as specified by 'csurf' package
     * enableCSRFCookie: boolean
     * package here: https://github.com/expressjs/csurf
     * TODO: end
     */
	csrf: boolean | CSRFOptions,
	//? More middleware options...
	staticOptions?: ServeStaticOptions
}

export interface Type<T> { new(...args: any[]): T }