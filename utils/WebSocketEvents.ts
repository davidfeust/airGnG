interface ObjectLiteral {
    [key: string]: ((e: MessageEvent<any>) => any)[];
}

export default class WSEvents {
    events: ObjectLiteral;

    constructor() {
        this.events = {};
    }

    registerEvent(event: string, func: (e: MessageEvent<any>) => any) {
        if (event in this.events) {
            this.events[event].push(func);
        } else {
            this.events[event] = [];
        }
    }

    unRegisterEvent(event: string) {
        if (event in this.events) {
            delete this.events.event;
        }
    }

    post(event: MessageEvent<any>) {
        if (event.data in this.events) {
            this.events[event.data].forEach((func) => {
                func(event);
            });
        }
    }
}
