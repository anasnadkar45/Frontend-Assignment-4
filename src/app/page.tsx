import { Button } from "@/components/ui/button";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <main >
      {
        user ? (
          <Button><LogoutLink>Log out</LogoutLink></Button>
        ) : (
          <div>
            <Button><LoginLink>Sign in</LoginLink></Button>
            <Button><RegisterLink>Sign up</RegisterLink></Button>
          </div>
        )
      }
    </main>
  );
}
