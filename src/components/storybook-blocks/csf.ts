type UnknownRecord = Record<string, unknown>

type MaybeStoryObject = {
  name?: string
  storyName?: string
  args?: Record<string, unknown>
  component?: unknown
  render?: (args?: Record<string, unknown>) => unknown
}

type StoryFn = ((args?: Record<string, unknown>) => unknown) & {
  name?: string
  storyName?: string
  args?: Record<string, unknown>
}

type CsfMeta = {
  title?: string
  args?: Record<string, unknown>
  component?: unknown
}

export type ResolvedStory = {
  exportName: string
  name: string
  args: Record<string, unknown>
  component: unknown
  render?: (args?: Record<string, unknown>) => unknown
  raw: unknown
}

const isRecord = (value: unknown): value is UnknownRecord =>
  value !== null && typeof value === 'object'

const isStoryFn = (value: unknown): value is StoryFn => typeof value === 'function'

const isStoryObject = (value: unknown): value is MaybeStoryObject =>
  isRecord(value) &&
  ('args' in value || 'render' in value || 'name' in value || 'storyName' in value || 'component' in value)

const isCsfModule = (value: unknown): value is UnknownRecord =>
  isRecord(value) && 'default' in value

const getMeta = (value: unknown): CsfMeta => {
  if (!isCsfModule(value)) {
    return {}
  }
  const meta = value.default
  return isRecord(meta) ? (meta as CsfMeta) : {}
}

const storyEntries = (value: unknown): [string, unknown][] => {
  if (!isCsfModule(value)) {
    return []
  }
  return Object.entries(value).filter(([key, entry]) => {
    if (key === 'default' || key === '__esModule') {
      return false
    }
    return isStoryFn(entry) || isStoryObject(entry)
  })
}

const toDisplayName = (exportName: string) =>
  exportName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase())

const resolveNamedStory = (entry: unknown, exportName: string, meta: CsfMeta): ResolvedStory => {
  if (isStoryFn(entry)) {
    return {
      exportName,
      name: entry.storyName ?? entry.name ?? toDisplayName(exportName),
      args: { ...(meta.args ?? {}), ...(entry.args ?? {}) },
      component: meta.component,
      render: entry,
      raw: entry
    }
  }

  const story = (entry as MaybeStoryObject) ?? {}
  return {
    exportName,
    name: story.storyName ?? story.name ?? toDisplayName(exportName),
    args: { ...(meta.args ?? {}), ...(story.args ?? {}) },
    component: story.component ?? meta.component,
    render: typeof story.render === 'function' ? story.render : undefined,
    raw: entry
  }
}

export const resolveMetaTitle = (of: unknown, explicitTitle?: string) => {
  if (explicitTitle) {
    return explicitTitle
  }
  const meta = getMeta(of)
  return meta.title
}

export const resolveStory = (of: unknown, name?: string): ResolvedStory | null => {
  const meta = getMeta(of)

  if (isCsfModule(of)) {
    const entries = storyEntries(of)
    if (!entries.length) {
      return null
    }

    const picked = name
      ? entries.find(([exportName, entry]) => {
          const candidate = resolveNamedStory(entry, exportName, meta)
          return exportName === name || candidate.name === name
        })
      : entries[0]

    if (!picked) {
      return null
    }
    return resolveNamedStory(picked[1], picked[0], meta)
  }

  if (isStoryFn(of)) {
    return resolveNamedStory(of, name ?? 'Story', {})
  }

  if (isStoryObject(of)) {
    return resolveNamedStory(of, name ?? 'Story', {})
  }

  return null
}

export const resolveStories = (of: unknown): ResolvedStory[] => {
  const meta = getMeta(of)
  if (!isCsfModule(of)) {
    const single = resolveStory(of)
    return single ? [single] : []
  }
  return storyEntries(of).map(([exportName, entry]) => resolveNamedStory(entry, exportName, meta))
}

