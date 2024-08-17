import Image from 'next/image'
import React from 'react'
import Logo from '../../../../public/Logo.svg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LoginLink, RegisterLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { UserNav } from './UserNav'

const Navbar = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  return (
    <div className='border-b'>
      <div className='w-full flex justify-between items-center py-3 px-3 md:px-3 max-w-[1380px] mx-auto'>
        <div className='flex gap-10 justify-center items-center'>
          <Link href={'/'} className='flex gap-3 justify-center items-center'>
            <Image src={Logo} alt='ProjectsHub Logo' width={40} height={40} />
            <h1 className='font-extrabold text-2xl'><span className='text-primary'>Projects</span>Hub</h1>
          </Link>
        </div>

        <div className='md:flex gap-3 hidden justify-center items-center'>
          {/* <ModeToggle /> */}
          {!user ? (
            <Button size={"sm"} asChild>
              <LoginLink>Sign in</LoginLink>
            </Button>
          ) : (
            <UserNav
              email={user.email as string}
              name={user.given_name as string}
              userImage={
                user.picture ?? `https://avatar.vercel.sh/${user.given_name}`
              }
            />
          )}

        </div>

      </div>
    </div>

  )
}

export default Navbar