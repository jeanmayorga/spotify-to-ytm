import { Input } from "~/components/ui/input";

export default function Search() {
  return (
    <div className="px-12">
      <div className="mb-4">
        <Input
          className="rounded-full w-80"
          placeholder="What do you want to play?"
          autoFocus
        />
      </div>
    </div>
  );
}
