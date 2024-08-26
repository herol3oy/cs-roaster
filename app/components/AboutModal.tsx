import { useEffect, useState } from 'react'

import styles from '@/app/components/about.module.css'

export default function AboutModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkTheme ? 'light' : 'dark',
    )
  }, [isDarkTheme])

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
            <li
              className={styles.icon}
              onClick={() => setIsDarkTheme((p) => !p)}
            >
              {isDarkTheme ? '🦉' : '🔆'}
            </li>
            <li className={styles.about} onClick={() => setIsModalOpen(true)}>
              🙋‍♂️
            </li>
          </ul>
        </nav>
      </header>
      <dialog open={isModalOpen}>
        <article>
          <header>
            <button
              aria-label='Close'
              rel='prev'
              onClick={() => setIsModalOpen(false)}
            />
            <p>
              <strong>About Me</strong>
            </p>
          </header>
          <p>
            I&apos;m Hamed, a front-end developer (
            <a href='https://github.com/herol3oy' target='_blank'>
              github
            </a>
            ) based in Warsaw, Poland, with a passion for{' '}
            <a href='https://couchsurfing.com/people/herol3oy' target='_blank'>
              CouchSurfing
            </a>
            . I&apos;m currently seeking a new opportunity in a front-end role.
            If you know of any openings or would like to connect, feel free to
            reach out at
            <a href='mailto:sedighi@duck.com'>sedighi@duck.com</a>
          </p>
        </article>
      </dialog>
    </>
  )
}
