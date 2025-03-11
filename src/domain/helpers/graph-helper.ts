export function reduceRecordsData<T>(
  collection: T[],
  desiredRecords: number = 100,
): T[] {
  if (collection.length <= desiredRecords) {
    return collection
  }

  const step: number = (collection.length - 1) / (desiredRecords - 1)
  const reducedData: T[] = []

  for (let i: number = 0; i < desiredRecords - 1; i++) {
    const index: number = Math.floor(i * step)
    reducedData.push(collection[index])
  }

  reducedData.push(collection[collection.length - 1])

  return reducedData
}
