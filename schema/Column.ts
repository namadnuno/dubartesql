interface IColumn {
    auto_increment: boolean
    unique: boolean
    primary: boolean
    null: boolean
}

export default class Column {
    private definition: IColumn;
    private name: string;
    private _default?: string;
    private _triggers: Record<string, string>;
    private dataType: string;

    constructor(name: string, dataType: string) {
        this.definition = {
            auto_increment: false,
            unique: false,
            primary: false,
            null: false
        }

        this.name = name;
        this.dataType = dataType;
        this._triggers = {};
        this._default = '';
    }

    incrementable() {
        this.definition.auto_increment = true;
        return this;
    }

    asPrimaryKey() {
        this.definition.primary = true;
        return this;
    }

    isPrimaryKey() {
        return this.definition.primary;
    }

    nullable() {
        this.definition.null = true;
        return this;
    }

    default(defaultValue: string) {
        if (defaultValue.indexOf('(') > -1 && defaultValue.indexOf(')') > -1) {
            this._default = defaultValue;
        } else {
            this._default = `'${defaultValue}'`;
        }

        return this;
    }

    withTrigger(on: string, action: string) {
        this._triggers[on] = action;
        return this;
    }

    triggersToString() {
        let string = '';
        for(let triggerKey of Object.keys(this._triggers)) {
            string += `ON ${triggerKey} ${this._triggers[triggerKey]}`
        }
        return string;
    }

    getExtraSql() {
        if (this.isPrimaryKey()) {
            return `PRIMARY KEY (${this.name})`
        }

        return "";
    }

    toSqlString() {
        return (`${this.name} ${this.dataType} ${this.definition.null ? 'NULL' : 'NOT NULL'} ${this._default != '' ? 'DEFAULT ' + this._default : ''} ${this.definition.auto_increment ? 'AUTO_INCREMENT' : ''} ${this.triggersToString()}`).replace('  ', ' ').trim()
    }
}
