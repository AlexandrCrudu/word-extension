import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { CategoryType } from "../types/categories";

interface DropdownType {
  categories: CategoryType[];
  category: CategoryType;
  setCategory: (category: CategoryType) => void;
}

export function CategoriesDropdown({ categories, setCategory, category }: DropdownType) {
  const handleChange = (event: SelectChangeEvent) => {
    setCategory(JSON.parse(event.target.value));
  };

  return (
    <Box sx={{ minWidth: 100, margin: "1rem" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={JSON.stringify(category)}
          label="Category"
          onChange={handleChange}
        >
          {categories.map((category) => (
            <MenuItem value={JSON.stringify(category)} key={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
