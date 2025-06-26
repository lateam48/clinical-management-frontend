// this is how to call user data on client side (zustand) :

```
import { useUserStore, UserStore } from "@/stores/userStore"

  const user = useUserStore((state: UserStore) => state.user)

  const userId = user?.id
```

// this is how to call user data on server side :

```
import { getAuthenticatedUser } from "@/lib/serverAuth"
import { UserRoles } from "@/types"

    const { session } = await getAuthenticatedUser({
        allowedRoles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.COMPANY],
        authRedirect: "/login", (optional)
        authzRedirect: "/unauthorized", (optional)
    })

    // get user data

    const user = session?.user;
    const userId = session?.user?.id;
```
