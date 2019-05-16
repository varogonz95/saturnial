# Saturnial <span style="font-weight: 200; font-size: large; color: #888">The MVC Framework for Typescript and Express lovers.</span>

## Table of contents
* [Installation](#installation)
* [Requirements](#requirements)
* [Usage - Getting started](#usage-getting-started)
* [Configuration](#configuration)
* [Middlewares](#middlewares)
* [Routing](#routing)
* [Controllers](#controllers)
* [Response](#responses)
* [Views](#views)
* [Helpers](#helpers)
* [Database w/TypeORM](#database-w-typeorm)
* [Security](#security)


## Installation
To install **Saturnial**, you just need to have *NPM*.  
Run the command below in your favorite terminal and you are set!

    > npm install saturnial

## Requirements
Saturnial requires **Node v6.16** or higher to run.  

Although it is transpiled from *TypeScript* to *JavaScript*, it is **recomended** to write your applications with *TypeScript* and then transpile them to *.js* files.  

Saturnial makes use of [*Decorators*](https://www.typescriptlang.org/docs/handbook/decorators.html), as well as it exposes some Decorators too.  
So, when using Saturnial with TypeScript, make sure to enable *TSC* (TS Compiler) *Experimental Options* in your `tsconfing.json` file:
```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```
But - **When should I use JavaScript?**  
Well, you *can* use Saturnial with JS, as long as you don't use *Decorators* (at least that you write them yourself) or any other TS feature unsupported by vanilla JS.
***

## Usage - Getting started
By simply calling `App.create(...)`, you create and `App` instance with the specified configurations passed as parameters or just use the defaults by passing none.  

For example:
```ts
import { App } from "saturnial"

// Use defaults
const app = App.create()
// ... or customize App config
const config = {
    host: 'localhost',
    port: 3000,
    // Path to static content folder
    static: './public'
}
const app = App.create(config)
```
<small>See more information ...</small>  

Once `App` instance is created, you can register *Routes*, *Controllers* and finally serve your *Application*.
```ts
import { App } from "saturnial"
import { ExampleController } from "./controllers"

// Create App instance
const app = App.create(/* config */)

app.routes()
    // Binds `ExampleController[list]` action to /blogs [GET] route
   .get('/blogs', 'Example', 'list')
    // Binds `ExampleController[create]` action to /blog [POST] route
   .post('/blog', 'Example', 'create')
   .put('/blog/:blogId', () => 'Updates blog with ID: {blogId}')
   .patch('/blog/:blogId', () => 'Updates blog with ID: {blogId}')
   .delete('/blog/:blogId', () => 'Removes blog with ID {blogId}')

app.serve(() => console.log('Your Application is being served'))
```

As shown in the example above, `Routes` are binded to `Controller` actions or just `anonymous functions` for simpler routing handlers.  

<small>See more information in [`Routing`]() and [`Controllers`]() sections</small>
***

## Configuration
When creating an `App` instance, you can either pass Config parameters or none for a default setup.  
These configurations correspond to multiple types, consumed and parsed by `Config` class.  
Also, `App.create(...)` method accepts a string parameter representing the relative path to a *.json* file describing you Application setup.

App.create() has the follwing signatures:
* `App.create()`
* `App.create(config: string | ConfigOptions | ServerConfig | ServerMiddlewareConfig)`
* `App.create(config: string | ConfigOptions | ServerConfig, middlewares: ServerMiddlewareConfig)`

Each of the config types are explained below.

#### `ConfigOptions` object:
This object wraps the Application Config (`AppConfig`), Application secret (used to protect your application against XSRF attacks) and Server Config (`ServerConfig`).
* `app: AppConfig`
* `secret?: string`
* `server: ServerConfig`
***

## Middlewares
***

## Routing
***

## Controllers
***

## Responses
***

## Views
***

## Helpers
***

## Database - TypeORM
***

## Security
