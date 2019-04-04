# App helpers

Note: Helpers will (and should) be available in Views as well

### List of proposed helpers:
- **previous(): string**
    - `@returns` string representing previous URL
- **config(key: string, defaults?: object): any**
    - `@param [key]`: Dot notation path to traverse the config object properties.<br>
        Example: 
        ```javascript
        const config = {
          app: {
             base: './',
             name: 'Some cool name',
             obj: { prop1: 'value1', prop2: 'value2' }
          }
        }

        console.log(config('app.name'))
        console.log(config('app.obj.prop1'))
        console.log(config('app.obj.prop3', 'default value'))
        
        // outputs: 'Some cool name'
        // outputs: 'value1'
        // outputs: 'default value'
        ```
    - `@param [defaults] (optional)`: Default value if properties path parameter could not be found
