import React, { ChangeEvent, PropsWithChildren, ReactElement } from 'react'
import styles from './Input.module.scss'

interface InputProps<T> {
  value?: T
  onChange?: (value: T) => void
  onDefaultChange?: (e: ChangeEvent) => void
  label?: string
  placeholder?: string
  defaultValue?: string
  error?: string
  name?: string
  disabled?: boolean
}

export function Input <T, > (props: PropsWithChildren<InputProps<T>>): ReactElement {
  return (
    <div className={styles.root}>
      {
        props?.label !== undefined && (
          <div className={styles.label}>{props.label}</div>
        )
      }
      <input
        name={props.name}
        className={styles.input}
        value={props.value?.toString()}
        disabled={props.disabled}
        onChange={(e) => {
          props.onDefaultChange?.(e)
          props.onChange?.(e.target.value as T)
        }}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
      />
      {
        props?.error !== undefined && (
          <div className={styles.error}>{props.error}</div>
        )
      }
    </div>
  )
}
