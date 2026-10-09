export function parseJson(json: string): any {
    try {
        if (!json) {
            return null;
        }
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}
