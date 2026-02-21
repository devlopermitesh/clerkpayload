import { Button } from '@/components/ui/button'
import payloadConfig from '@/payload.config'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { Book } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

export default async function Home() {
  const user = await auth()
  const payload = await getPayload({
    config: payloadConfig,
  })
  const result = await payload.find({
    collection: 'posts',
    where: {},
  })

  return (
    <div className="bg-primary">
      <header className="flex justify-between items-center p-4 gap-4 h-16">
        <span className=" text-center flex items-center justify-center gap-2 text-white">
          <Book className="w-8 h-8" />
          <h2 className="text-white font-medium text-2xl  italic">Library Stories</h2>
        </span>
        <div className="flex  items-center justify-center">
          <Link href={`${user?.userId ? '/organizations/create-organization' : '/organizations'}`}>
            <Button
              className="text-[#6c47ff] text-white bg-primary hover:bg-[#6c47ff] hover:text-white text-xl cursor-pointer"
              variant={'outline'}
            >
              Create your Library
            </Button>
          </Link>
          {/* Show the sign-in and sign-up buttons when the user is signed out */}
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          {/* Show the user button when the user is signed in */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <div>{JSON.stringify(result, null, 2)}</div>
    </div>
  )
}
