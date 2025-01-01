interface Map<K, V> {
    getOrDefault(key: K, def: V): V;
    toJSON(): Record<string, V>;
}

Object.defineProperties(Map.prototype, {
    getOrDefault: {
        value: function <K, V>(this: Map<K, V>, key: K, def: V): V {
            return this.has(key) ? this.get(key)! : (this.set(key, def), def);
        }
    },
    toJSON: {
        value: function toJSON(this: Map<unknown, unknown>) {
            return Object.fromEntries(this.entries());
        }
    }
});
