const { App } = require("saturnial")

const app = App.create()

// Returns AppContainerCollection instance
app.container()

// Returns Router instance
app.router()

// Serves application
app.serve(/* settings?: IServerSettings, callback?: () => void */)
