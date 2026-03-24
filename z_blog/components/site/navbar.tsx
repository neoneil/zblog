
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/logout-button";
import Container from "./container";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
  }

  const canManagePosts = role === "admin" || role === "editor";

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "User";

  const email = user?.email || "";

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    "/default-avatar.png";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <Container>
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white transition hover:text-white/85 sm:text-xl"
          >
            Cosmic Childhood
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/categories"
              className="rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Main categories
            </Link>

            <Link
              href="/resources"
              className="rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Resources
            </Link>

            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              About us
            </Link>

            {/* {user ? (
              <>
                {canManagePosts && (
                  <Link
                    href="/admin/posts"
                    className="rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    Admin
                  </Link>
                )}

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 shadow-sm backdrop-blur-md">
                  <Image
                    src={avatar}
                    alt={name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15"
                  />

                  <div className="hidden lg:flex flex-col leading-tight">
                    <span className="text-sm font-medium text-white">
                      {name}
                    </span>
                    <span className="max-w-45 truncate text-xs text-white/55">
                      {email}
                    </span>
                  </div>
                </div>

                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-full border border-white/15 bg-white/90 px-4 py-2 text-sm font-semibold text-black transition hover:bg-white"
                >
                  Sign up
                </Link>
              </>
            )} */}
          </nav>
        </div>
      </Container>
    </header>
  );
}

// import Link from "next/link";
// import { createClient } from "@/lib/supabase/server";
// import LogoutButton from "@/components/auth/logout-button";
// import Image from "next/image";
// import Container from "./container";
// export default async function Navbar() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   let role: string | null = null;

//   if (user) {
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     role = profile?.role ?? null;
//   }

//   const canManagePosts = role === "admin" || role === "editor";


// // 显示google 用户信息 

//  const name =
//     user?.user_metadata?.full_name ||
//     user?.user_metadata?.name ||
//     "User";

//   const email = user?.email || "";

//   const avatar =
//     user?.user_metadata?.avatar_url ||
//     user?.user_metadata?.picture ||
//     "/default-avatar.png";

//   return (
//     <header className="sticky top-0 z-50 border-b backdrop-blur" >
//       <Container>
//         <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
//           <Link href="/" className="text-lg font-bold tracking-tight sm:text-xl">
//             Cosmic Childhood
//           </Link>

//           <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
//             <Link
//               href="/"
//               className="nav-link"
//             >
//               Home
//             </Link>
//             <Link
//               href="/"
//               className="nav-link"
//             >
//               Main categories
//             </Link>
//             <Link
//               href="/"
//               className="nav-link"
//             >
//               Resources
//             </Link>
//             <Link
//               href="/"
//               className="nav-link"
//             >
//               About-us
//             </Link>
//             {/* <Link 
//               href="/tarot" 
//               className="nav-link">
//               Tarot
//             </Link>
//             <Link
//               href="/posts"
//               className="nav-link"
//             >
//               Posts
//             </Link> */}

//             {user ? (
//               <>
//                 {canManagePosts && (
//                   <Link
//                     href="/admin/posts"
//                     className="nav-link"
//                   >
//                     Admin
//                   </Link>
//                 )}

//                 {/* <span className="hidden text-sm text-gray-400 lg:inline">
//                   {user.email}
//                 </span> */}

//                  <div className="flex items-center gap-2 rounded-full px-2 py-1">
//                   <Image
//                     src={avatar}
//                     alt={name}
//                     width={36}
//                     height={36}
//                     className="h-9 w-9 rounded-full object-cover"
//                   />

//                   <div className="hidden lg:flex flex-col leading-tight">
//                     <span className="text-sm font-medium text-(--text)">
//                       {name}
//                     </span>
//                     <span className="text-xs text-gray-400">
//                       {email}
//                     </span>
//                   </div>
//                 </div>

//                 <LogoutButton />
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className="rounded-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
//                 >
//                   Login
//                 </Link>

//                 <Link
//                   href="/sign-up"
//                   className="rounded-full border px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
//                 >
//                   Sign up
//                 </Link>
//               </>
//             )}
//           </nav>
//         </div>
//       </Container>
//     </header>
//   );
// }