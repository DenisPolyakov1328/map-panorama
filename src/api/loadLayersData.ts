import { fetchLines, fetchRoadCross, fetchSemaphores } from './layersApi.ts'

export const loadLayersData = async () => {
  const [lines, roadCross, semaphores] = await Promise.all([
    fetchLines(),
    fetchRoadCross(),
    fetchSemaphores()
  ])

  return [
    { data: lines },
    { data: roadCross },
    { data: semaphores, cluster: true }
  ]
}
