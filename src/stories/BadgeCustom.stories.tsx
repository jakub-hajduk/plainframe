import StorybookBadge from '../components/examples/StorybookBadge.astro'

const meta = {
  title: 'Examples/Badge Custom',
  component: StorybookBadge,
  args: {
    tone: 'success'
  }
}

export default meta

export const Success = {
  name: 'Success badge (TSX)',
  args: {
    label: 'Success from .stories.tsx'
  }
}

export const CustomRender = {
  name: 'Custom render (TSX)',
  args: {
    label: 'Rendered by render() in .stories.tsx',
    tone: 'success'
  },
  render: (args: Record<string, unknown>) => {
    const label = String(args.label ?? 'Custom render')
    return `<div style=\"padding:0.75rem;border:1px dashed #10b981;border-radius:8px;color:#065f46\">${label}</div>`
  }
}
