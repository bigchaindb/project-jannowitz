export class Config {
    app: App
    bdb: Bdb
}

class App {
    id: string
    namespace: string
    types: Type[]
}

class Type {
    id: string
    name: string
    internalId: number
}

class Bdb {
    apiUrl: string
}
