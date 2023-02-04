import { DialogInstance, showDialog } from '@/core/dialog'
import type { Settings } from '@/core/settings/types'
import { Toast } from '@/core/toast'
import { mountVueComponent } from '@/core/utils'
import { useScopedConsole } from '@/core/utils/log'
import type { RecordValue } from '../types'
import type { BisectNext } from './bisect'
import { bisect } from './bisect'
import { BisectorOptions } from './options'
import ResultToastContent from './ResultToastContent.vue'

type UserComponent = RecordValue<Settings['userComponents']>

let bisectorOptions: BisectorOptions
let scopedConsole: ReturnType<typeof useScopedConsole>
let bisectorGenerator: ReturnType<typeof bisect>
let groupedComponents: Awaited<ReturnType<typeof classifyComponents>>
let dialog: DialogInstance

export const setOptions = (options: BisectorOptions) => {
  if (!bisectorOptions) {
    bisectorOptions = options
  } else {
    Object.assign(bisectorOptions, options)
  }
}

export const setConsole = (console: ReturnType<typeof useScopedConsole>) => {
  scopedConsole = console
}

const classifyComponents = async () => {
  const { settings } = await import('@/core/settings')

  const { userComponents } = settings
  const configurableUserComponents = lodash.pickBy(
    userComponents,
    v => v.metadata.configurable || true,
  )
  const { targetComponents, keepDisabledComponents, keepEnabledComponents } = lodash.transform(
    configurableUserComponents,
    (result, v, k) => {
      if (bisectorOptions.keepEnabledComponents?.includes(k)) {
        result.keepEnabledComponents.push(v)
        return
      }
      if (bisectorOptions.keepDisabledComponents?.includes(k)) {
        result.keepDisabledComponents.push(v)
        return
      }
      result.targetComponents.push(v)
    },
    {
      targetComponents: [] as UserComponent[],
      keepDisabledComponents: [] as UserComponent[],
      keepEnabledComponents: [] as UserComponent[],
    },
  )

  return {
    userComponents,
    configurableUserComponents,
    targetComponents,
    keepDisabledComponents,
    keepEnabledComponents,
  }
}

const setComponentsEnabled = (components: UserComponent[], enabled: boolean) =>
  components.forEach(component => (component.settings.enabled = enabled))

const getComponentNames = (components: UserComponent[]) =>
  components
    .map(component => `${component.metadata.displayName}（${component.metadata.name}）`)
    .join(', ') || '无'

export const isRecover = () => !lodash.isEmpty(bisectorOptions.bisectInitialState)

export const stop = async () => {
  scopedConsole?.log('stop - 准备停止组件二等分')
  dialog?.close()
  const { configurableUserComponents } = await classifyComponents()
  const unmatchedComponentNames = []
  for (const [componentName, componentSettings] of Object.entries(configurableUserComponents)) {
    const originalStatus = bisectorOptions.originalComponentEnableState?.[componentName]
    if (originalStatus == null) {
      unmatchedComponentNames.push(componentName)
      continue
    }
    componentSettings.settings.enabled = originalStatus
  }
  if (unmatchedComponentNames.length) {
    scopedConsole?.warn(
      `stop - 部分组件未能还原状态：${getComponentNames(unmatchedComponentNames)}`,
    )
  }
  scopedConsole?.log('stop - 清理状态')
  bisectorGenerator = null
  bisectorOptions.bisectInitialState = {}
  scopedConsole?.log('stop - 重载页面')
  location.reload()
}

export const next = async (seeingBad?: boolean, autoReload?: boolean) => {
  dialog?.close()
  scopedConsole?.log(
    `next - 当前工作状态：${
      // eslint-disable-next-line no-nested-ternary
      seeingBad == null ? '未知' : seeingBad ? '异常' : '正常'
    }`,
  )
  const { done, value } = bisectorGenerator.next(seeingBad) as unknown as {
    done: boolean
    value: BisectNext<UserComponent> | UserComponent
  }
  if (done) {
    const elementId = `bisector-result-toast-content-${Math.floor(
      Math.random() * (Number.MAX_SAFE_INTEGER + 1),
    )}`
    Toast.info(/* html */ `<div id="${elementId}"></div>`, '二等分结果')
    setTimeout(() => {
      const vm = mountVueComponent<{ userComponent: UserComponent }>(
        ResultToastContent,
        `#${elementId}`,
      )
      vm.userComponent = value as UserComponent
      vm.$on('restore', () => {
        stop()
      })
    })
  } else {
    const { slice, low, high } = value as BisectNext<UserComponent>
    const needEnabled = slice
    const needDisabled = lodash.difference(groupedComponents.targetComponents, slice)
    bisectorOptions.bisectInitialState = { low, high }
    scopedConsole?.log(`next - 关闭组件：${getComponentNames(needDisabled)}`)
    scopedConsole?.log(`next - 开启组件：${getComponentNames(needEnabled)}`)
    setComponentsEnabled(needDisabled, false)
    setComponentsEnabled(needEnabled, true)
    if (autoReload) {
      scopedConsole?.log('next - 重载页面')
      location.reload()
    }
  }
  return { done, value }
}

export const recover = async () => {
  scopedConsole?.log('recover - 准备恢复组件二等分')
  groupedComponents = await classifyComponents()
  const { targetComponents, keepDisabledComponents, keepEnabledComponents } = groupedComponents
  setComponentsEnabled(keepEnabledComponents, true)
  setComponentsEnabled(keepDisabledComponents, false)
  scopedConsole?.log(`recover - 保持关闭组件：${getComponentNames(keepDisabledComponents)}`)
  scopedConsole?.log(`recover - 保持开启组件：${getComponentNames(keepEnabledComponents)}`)
  scopedConsole?.log(`recover - 全部目标组件：${getComponentNames(targetComponents)}`)
  bisectorGenerator = bisect(targetComponents, bisectorOptions.bisectInitialState)
  const { done, value } = await next()
  if (!done) {
    const { rouge } = value as BisectNext<UserComponent>
    dialog = showDialog({
      title: () => import('./DialogTitle.vue'),
      content: () => import('./DialogContent.vue'),
      contentProps: {
        rouge,
        onGood: () => next(false, true),
        onBad: () => next(true, true),
        onAbort: () => stop(),
      },
    })
  }
}

export const start = async () => {
  if (isRecover()) {
    await recover()
    return
  }
  scopedConsole?.log('start - 准备开始组件二等分')
  groupedComponents = await classifyComponents()
  const {
    configurableUserComponents,
    targetComponents,
    keepDisabledComponents,
    keepEnabledComponents,
  } = groupedComponents
  scopedConsole?.log('start - 保存组件初始启用状态')
  bisectorOptions.originalComponentEnableState = lodash.mapValues(
    configurableUserComponents,
    v => v.settings.enabled,
  )
  setComponentsEnabled(targetComponents, true)
  setComponentsEnabled(keepEnabledComponents, true)
  setComponentsEnabled(keepDisabledComponents, false)
  scopedConsole?.log(`start - 保持关闭组件：${getComponentNames(keepDisabledComponents)}`)
  scopedConsole?.log(`start - 保持开启组件：${getComponentNames(keepEnabledComponents)}`)
  scopedConsole?.log(`start - 启用全部目标组件：${getComponentNames(targetComponents)}`)
  bisectorGenerator = bisect(targetComponents, bisectorOptions.bisectInitialState)
  await next(undefined, true)
}
