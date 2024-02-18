export default class Strings {

  _map: Map<string, string>

  constructor(arr) {
    this._map = new Map<string, string>(arr)
  }

  get(key: string, d?: string): string {
    return (this._map.get(key) || d || key)
  }
}