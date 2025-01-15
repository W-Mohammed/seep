// formkit.config.ts
import { defaultConfig } from '@formkit/vue'
import { genesisIcons } from '@formkit/icons'
import { rootClasses } from './formkit.theme.ts'

export default defaultConfig({
  config: {
    rootClasses
  },
  icons: { ...genesisIcons }
})
