import Image from 'next/image'
import React from 'react'
import Logo from '../../../../public/Logo.svg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LoginLink, RegisterLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { UserNav } from './UserNav'
import CreateProduct from '@/app/(main)/forms/CreateProduct'
import { ShoppingCart } from 'lucide-react'

const Navbar = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  return (
    <div className='fixed right-2 left-2 top-0 z-50'>
      <div className='bg-primary mt-2 rounded-md w-full flex justify-between items-center py-3 px-3 md:px-3 max-w-[1250px] mx-auto'>
        <div className='flex gap-10 justify-center items-center'>
          <Link href={'/'} className='flex gap-3 justify-center items-center'>
            <Image src={Logo} alt='ProjectsHub Logo' width={40} height={40} />
            <h1 className='font-extrabold text-2xl text-muted'><span className='text-background'>Profile</span> Ecommerce</h1>
          </Link>
        </div>

        <div className='md:flex gap-3 hidden justify-center items-center'>
          {/* <ModeToggle /> */}
          {!user ? (
            <div className='flex items-center gap-2'>
              <Button variant={'secondary'} size={"sm"} asChild>
                <LoginLink>Sign in</LoginLink>
              </Button>
              <Button variant={'secondary'} size={"sm"} asChild>
                <RegisterLink>Register</RegisterLink>
              </Button>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              {
                user?.email === "anasnadkar23@gmail.com" && (
                  <CreateProduct />
                )
              }
              <Link href={'/cart'}>
                <Button variant={'outline'} size={'icon'} className='bg-transparent text-white'>
                  <ShoppingCart />
                </Button>
              </Link>
              <UserNav
                email={user.email as string}
                name={user.given_name as string}
                userImage={
                  user.picture ?? `https://avatar.vercel.sh/${user.given_name}`
                }
              />
            </div>
          )}

        </div>

      </div>
    </div>

  )
}

export default Navbar