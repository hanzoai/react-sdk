import { isFunction } from '@hanzo/utils'
import midstream from 'midstream'
import { useState } from 'react'

export default function (config, opts) {
  const [dst] = useState(() => (opts && (opts.dst || opts.destination)) || {})
  const [err] = useState(() => (opts && (opts.err || opts.errors)) || {})

  let id
  let enableTick = false

  // standard force rerender hack
  const [, setTick] = useState(0)

  const [ms] = useState(() => {
    let tick = 0

    return midstream(config, {
      dst: (name, value) => {
        if (isFunction(dst)) {
          dst(name, value)
        } else {
          dst[name] = value
        }
        if (enableTick && !id) {
          id = setTimeout(() => {
            setTick(tick++)
            id = undefined
          }, 100)
        }
      },
      // err behaves just like dst
      err: (name, value) => {
        if (isFunction(err)) {
          err(name, value)
        } else {
          err[name] = value
        }
        if (enableTick) {
          setTick(tick++)
        }
      },
    })
  })

  const ret = { ...ms }

  setTimeout(() => {
    enableTick = true
  }, 1000)

  return Object.assign(ret, {
    get dst() {
      return dst
    },
    get err() {
      return err
    },
  })
}

