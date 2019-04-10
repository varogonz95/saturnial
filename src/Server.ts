import cors from "cors";
import csurf from "csurf";
import session from "express-session"
import methodOverride from "method-override";
import bodyParser from "body-parser"
// import cookieParser from "cookie-parser"

import * as Path from "path";
import { Router } from "./Router";
import express, { RequestHandler } from "express";
import { AppContainer } from "./Container";
import { RouteResolver, HttpContext } from "./RouteResolver";
import { ServerMiddlewareConfig, ServerConfig, CSRFOptions } from "./interfaces";
import { extend } from "./Helpers";
import { Config } from "./Config";
import { InternalErrorResponse } from "./ActionResponse";
import { HTTP_METHODS } from "./Utils";

const DEFAULT_SERVER_MIDDLEWARES: ServerMiddlewareConfig = {
	cors: true,
	csrf: { cookie: false }
}

export class Server {

    private resolver: RouteResolver
    private application: express.Application
	private conf: ServerConfig

	constructor()
	constructor(config: ServerConfig)
	constructor(config: ServerConfig, middlewares?: ServerMiddlewareConfig)
    constructor(config?: ServerConfig, middlewares?: ServerMiddlewareConfig) {
        this.application = express()
        this.resolver = new RouteResolver(this.application, AppContainer.getInstance().controller())
		this.conf = config? extend(Config.server(), config) : Config.server()

		// Setup server
		this.config(middlewares)
	}

    start(callback?: Function) {
		console.log('Binding routes...');
		this.bindRoutes()

		if (this.conf.host === undefined)
			this.application.listen(
				Config.server().port,
				() => { if (callback) callback() }
			)
		else
			this.application.listen(
				Config.server().port,
				Config.server().host,
				() => { if (callback) callback() }
			)
    }

    public middleware(...middlewares: RequestHandler[]): void {
        this.application.use(...middlewares)
    }

    private bindRoutes(): void {
        this.resolver.resolve(...Router.all())
	}

    private config(middlewares?: ServerMiddlewareConfig): void {
		if (typeof middlewares === "undefined")
			this.config(DEFAULT_SERVER_MIDDLEWARES)
		else {

			// Enable method spoofing
			this.application.use(methodOverride(methodOverrideGetter))

			// Enable sessions
			// this.application.use(cookieParser())
			this.application.use(session({
				secret: 'a6d8984bad38158f18e77e3924cb65c9c3bc5b69',
				resave: false,
				saveUninitialized: true
			}))

			// Enable application/json support
			this.application.use(bodyParser.json())
	
			// Enable application/x-www-form-urlenconded support
			this.application.use(bodyParser.urlencoded({ extended: false }))

			//! BUG: @throws invalid csrf token
			// Enable CSRF Protection
			if (typeof middlewares.csrf === "boolean")
				this.application.use(csurf())
			else if (typeof middlewares.csrf === "object")
				this.application.use(csurf({cookie: false}))

			this.application.use(invalidToken);
			// Enable CORS
			if (typeof middlewares.cors === "boolean")
				this.application.use(cors())
			else if (typeof middlewares.cors === "object")
				this.application.use(cors(middlewares.cors))
				
			// Serve static content (eg. .css files, scripts, etc...)
			const staticContent = this.conf.static
			if (typeof staticContent === "string") {
				let path = Path.resolve(__dirname, Path.relative(__dirname, staticContent))
				if (middlewares.staticOptions === undefined)
					this.application.use(
						this.normalizeStaticPath(staticContent),
						express.static(path))
				else
					this.application.use(
						this.normalizeStaticPath(staticContent), 
						express.static(path, middlewares.staticOptions))
			}
		}
    }
	
	private normalizeStaticPath(path: string) {
		return !path.startsWith('/') ? `/${path}` : path
	}
}

//* Taken from: https://github.com/expressjs/method-override#custom-logic
function methodOverrideGetter(req: express.Request) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		var method = req.body._method
		delete req.body._method
		return method
	}
}

function invalidToken(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
	//* Create context
	HttpContext.create({
		action: null,
		handler: null,
		method: HTTP_METHODS[req.method]
	}, req, HTTP_METHODS[req.method])
	if (err.code !== 'EBADCSRFTOKEN') 
		return next(err);
	let response = new InternalErrorResponse(err, 403)
	response.send()
}