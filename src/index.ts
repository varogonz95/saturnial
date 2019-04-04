import "reflect-metadata";
import { action } from "./Decorators";
import { App } from "./App";
import { AppConfig, ConfigOptions, IProviderCollection, ServerConfig, ServerMiddlewareConfig, Type } from "./interfaces";
import { AppContainer } from "./Container";
import { Config } from "./Config";
import { Controller } from "./Controller";
import { extend } from "./Helpers";
import { GenericClassDecorator, GenericPropertyDecorator, HTTP_METHODS } from "./Utils";
import { IRoute, Router } from "express-serve-static-core";
import { RouteResolver } from "./RouteResolver";
import { Server } from "./Server";
import { View } from "./View";

export {
	action,
	App,
	AppConfig,
	AppContainer,
	Config,
	ConfigOptions,
	Controller,
	extend,
	GenericClassDecorator,
	GenericPropertyDecorator,
	HTTP_METHODS,
	IProviderCollection,
	IRoute,
	Router,
	RouteResolver,
	Server,
	ServerConfig, 
	ServerMiddlewareConfig,
	Type,
	View
}