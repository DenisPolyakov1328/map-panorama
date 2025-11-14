import semaphores from '../data/semaphores.json'
import lines from '../data/line.json'
import roadCros from '../data/road_cros.json'

// Open Layers накладывает слои друг на друга, хранить в правильном порядке
export const layersConfig = [
  { data: lines },
  { data: roadCros },
  { data: semaphores, cluster: true }
]
