"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { UserProfile } from "../types";
import { signOut } from "../actions";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  profile: UserProfile;
}

export function Header({ profile }: Props) {
  const pathname = usePathname();
  const today = new Date();
  const currentHours = today.getHours();

  return (
    <header className="px-12 py-8 relative z-20">
      <section className="flex items-center justify-between">
        <div className="flex items-center">
          <AnimatePresence>
            {!pathname.includes("/spotify/home") && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                exit={{ width: 0 }}
              >
                <Link href="/spotify/home">
                  <Button
                    className="rounded-full mr-2 "
                    size="icon"
                    variant="outline"
                  >
                    <ArrowLeft />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <Avatar className="mr-4 drop-shadow-md">
            <AvatarImage src={profile?.images?.[0]?.url} />
            <AvatarFallback>{profile?.display_name?.[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-semibold tracking-tight text-white drop-shadow-md">
            {profile.display_name.split(" ")[0]}
            {currentHours < 12
              ? ", good morning"
              : currentHours < 18
              ? ", good afternoon"
              : ", good evening"}
          </h2>
        </div>
        <form action={signOut}>
          <Button
            variant="ghost"
            className="rounded-full drop-shadow-md"
            type="submit"
          >
            Log out
          </Button>
        </form>
      </section>
    </header>
  );
}
