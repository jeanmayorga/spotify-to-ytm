"use client";

import { debounce } from "lodash";
import { CircleXIcon, SearchIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface Props {
  className?: string;
}
export function SearchInput({ className }: Props) {
  const router = useRouter();
  const params = useParams();

  const query = params.query;

  const onSearch = debounce((e) => {
    const query = e.target.value;
    if (query.length > 1) {
      router.push(`/spotify/search/${encodeURIComponent(query)}`);
    }
  }, 500);

  const cancelSearch = () => router.push("/spotify");

  return (
    <div className={cn("relative md:inline-block block", className)}>
      <SearchIcon className="w-4 h-4 absolute top-[11px] left-[13px] text-muted-foreground" />

      <Input
        className="rounded-full md:w-80 w-full pl-9"
        placeholder="What do you want to play?"
        autoFocus
        onChange={onSearch}
        defaultValue={decodeURIComponent(String(query || ""))}
      />

      {query && query?.length > 0 && (
        <Button
          size="icon"
          className="rounded-full absolute top-0 right-0 text-muted-foreground"
          variant="ghost"
          onClick={cancelSearch}
        >
          <CircleXIcon className="5-4 h-5" />
        </Button>
      )}
    </div>
  );
}
