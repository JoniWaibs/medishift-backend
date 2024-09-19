export class Server {
    #port: number
    constructor(port: number) {
        this.#port = port;
    }

    run() {
        console.warn(`info::Server running on port ${this.#port}`)
    }
}