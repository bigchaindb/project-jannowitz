export class Metadata {
    constructor() {
        this.date = new Date()
        this.timestamp = Date.now()
    }

    event: string
    eventType: number
    timestamp: number
    date: Date
    publicKey: string
    eventData: any
}
