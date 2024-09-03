import { useEffect, useState } from 'react'

import styles from './about-modal.module.scss'

export function AboutModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkTheme ? 'light' : 'dark',
    )
  }, [isDarkTheme])

  const toggleTheme = () => {
    setIsDarkTheme((isDark) => !isDark)
  }

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev)
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <hgroup>
                <h2>Couchsurfing Roaster</h2>
              </hgroup>
            </li>
          </ul>
          <ul>
            <li className={styles.icon} onClick={toggleTheme}>
              {isDarkTheme ? '🦉' : '🔆'}
            </li>
            <li className={styles.about} onClick={toggleModal}>
              🙋‍♂️
            </li>
          </ul>
        </nav>
      </header>
      <dialog open={isModalOpen}>
        <article>
          <header>
            <button aria-label='Close' rel='prev' onClick={toggleModal} />
            <p>
              <strong>About Me</strong>
            </p>
          </header>
          <p>
            I&apos;m Hamed, a front-end developer based in Warsaw, Poland, with
            a passion for{' '}
            <a href='https://couchsurfing.com/people/herol3oy' target='_blank'>
              CouchSurfing
            </a>
            . I&apos;m currently seeking a new opportunity in a front-end role.
            If you know of any openings or would like to connect, feel free to
            reach out at {` `}
            <a href='mailto:sedighi@duck.com'>sedighi@duck.com</a>
          </p>
        </article>
      </dialog>
    </>
  )
}
