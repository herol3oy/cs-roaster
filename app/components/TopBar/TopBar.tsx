import { useEffect, useState } from 'react'

import { BuyMeACoffeeButton } from '../BuyMeACoffeeButton'
import styles from './top-bar.module.scss'

export function TopBar() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'light' : 'dark')
  }, [isDarkTheme])

  const toggleTheme = () => {
    setIsDarkTheme((isDark) => !isDark)
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <strong>Couchsurfing AI Assistant</strong>
            </li>
          </ul>
          <ul>
            <li className={styles.icon} onClick={toggleTheme}>
              {isDarkTheme ? '🦉' : '🔆'}
            </li>
            <li className={styles.about}>
              <BuyMeACoffeeButton />
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
