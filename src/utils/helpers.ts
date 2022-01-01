export function checkIfValidData<T>(data: any): data is T {
  return typeof data === 'object' && !Array.isArray(data) && data
}
