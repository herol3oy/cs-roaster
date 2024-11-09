import Image from 'next/image'
import Link from 'next/link'

export function BuyMeACoffeeButton() {
  return (
    <Link
      href='https://www.buymeacoffee.com/herol3oy'
      target='_blank'
      rel='noopener noreferrer'
      passHref
    >
      <Image
        src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'
        alt='Buy Me a Coffee'
        width={108}
        height={30}
        priority
        style={{ width: 'auto' }}
      />
    </Link>
  )
}
