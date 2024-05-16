"use client";

import { debounce } from "lodash";
import { CircleXIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useQueryParams from "~/app/hooks/use-query-params";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface QueryParams {
  query?: string;
}

interface Props {
  className?: string;
}
export function SearchInput({ className }: Props) {
  const router = useRouter();
  const { queryParams, setQueryParams } = useQueryParams<QueryParams>();

  const query = queryParams.get("query") || "";

  const onSearch = debounce((e) => {
    const query = e.target.value;
    setQueryParams({ query });
  }, 200);

  const cancelSearch = () => router.push("/spotify");

  return (
    <div className={cn("relative inline-block", className)}>
      <SearchIcon className="w-4 h-4 absolute top-[11px] left-[13px] text-muted-foreground" />

      <Input
        className="rounded-full w-80 pl-9"
        placeholder="What do you want to play?"
        autoFocus
        onChange={onSearch}
        defaultValue={query}
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
