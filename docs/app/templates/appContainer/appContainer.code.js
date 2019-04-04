const { App } = require("saturnial")

const app = App.create()

app.container()

app.router()

app.serve()
