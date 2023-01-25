import { Button, Flex, Select } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import routes from "../../../routes/routes";
import { ITableFilters } from "./index";

export const NavFilter = ({ filters, setFilters }: { filters: ITableFilters, setFilters: (filters: ITableFilters) => void }) => {
  const navigate = useNavigate()
  return (
    <Flex justifyContent={"end"} alignItems={"end"} gap={"2"}>
      {Object.keys(filters).map((key, index) => {
        const filter = filters[key];
        return (
          <div key={index} className="flex flex-col">
            <label className="text-sm text-gray-700" htmlFor={key}>{filter.label}</label>
            <Select
              className="border border-gray-300 rounded-md px-2 py-1 mt-1 cursor-pointer"
              name={key}
              id={key}
              size="sm"
              value={filter.options.find(option => option.selected)?.value ?? ''}
              onChange={(e) => {
                const newFilters = { ...filters };
                newFilters[key].options = newFilters[key].options.map(option => {
                  return {
                    ...option,
                    selected: option.value === e.target.value,
                  }
                })
                setFilters(newFilters);
              }}
            >
              <option></option>
              {filter.options.map((option, key) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select >
          </div>
        )
      })}
      <Button
        colorScheme="blue"
        size="sm"
        className="ml-2"
        onClick={() => navigate(routes.NEWPATIENT)}
      >
        +
      </Button>
    </Flex>
  )
}
