import { Input } from "@chakra-ui/react"

export const Search = ({ search, setSearch }: { search: string, setSearch: (search: string) => void }) => {
  return (
    <div className="w-full mt-1 rounded-md shadow-sm">
      <Input
        bgColor={"gray.200"}
        type="text"
        name="price"
        id="price"
        className="block w-full rounded-md border-gray-300 px-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}