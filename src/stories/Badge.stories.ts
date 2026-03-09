import StorybookBadge from '../components/examples/StorybookBadge.astro'

const meta = {
  title: 'Examples/Badge',
  component: StorybookBadge,
  args: {
    tone: 'default'
  }
}

export default meta

export const Primary = {
  name: 'Primary badge (TS)',
  args: {
    label: 'Primary from .stories.ts'
  }
}

export const Warning = {
  args: {
    label: 'Warning from .stories.ts',
    tone: 'warning'
  }
}
