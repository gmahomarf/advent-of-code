interface Map<K, V> {
    getOrDefault(key: K, def: V): V;
}

Object.defineProperties(Map.prototype, {
    getOrDefault: {
        value: function <K, V>(this: Map<K, V>, key: K, def: V): V {
            return this.has(key) ? this.get(key)! : def;
        }
    }
});
