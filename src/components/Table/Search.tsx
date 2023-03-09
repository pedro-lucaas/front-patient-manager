import { Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { BiSearch } from "react-icons/bi"

export const Search = ({ search, setSearch }: { search: string, setSearch: (search: string) => void }) => {
  return (
    <div className="w-full mt-1 rounded-md shadow-sm">
      <InputGroup>
        <Input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border-gray-300 px-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Busque um paciente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement children={<BiSearch />} />
      </InputGroup>
    </div>
  )
}