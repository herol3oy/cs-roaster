import styles from './loading-spinner.module.scss'

export function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <h1 aria-busy>Loading</h1>
    </div>
  )
}
