import {DBConfig} from "./types.d.ts";
import {Client} from "https://deno.land/x/mysql/mod.ts";

export class Connector {
    private static _instance: Connector;
    private _client: Client;

    public constructor() {
        this._client = new Client();
    }

    public async connect(config: DBConfig) {
      await this._client.connect(config);
    }

    public static async connect(config: DBConfig)
    {
        if (this._instance && this._instance.hasConfig()) {
            return this._instance;
        }
        this._instance = new this();
        await this._instance.connect(config);
        return this._instance;
    }

    public static drop() {
        this._instance = new this();
    }

    public static get instance()
    {
        return this._instance || (this._instance = new this());
    }

    public hasConfig() {
        return this._client.config.db != undefined &&
            this._client.config.hostname != undefined &&
            this._client.config.username != undefined &&
            this._client.config.password != undefined;
    }

    public checkConnection () {
        if (!this.hasConfig()) {
            throw new Error("the client isn't connect, make sure to connect first!");
        }
    }

    get client() : Client {
        return this._client;
    }
}