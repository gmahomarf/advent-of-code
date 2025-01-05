interface Set<T> {
    toJSON(): string;
}

Object.defineProperties(Set.prototype, {
    toJSON: {
        value: function toJSON(this: Set<unknown>) {
            return '' + this.size + ' => ' + Array.from(this.values()).join(' | ');
        }
    }
});
