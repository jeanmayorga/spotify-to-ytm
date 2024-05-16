import { SearchInput } from "../components/search-input";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className="px-12">
      <SearchInput className="mb-8" />

      {children}
    </div>
  );
}
