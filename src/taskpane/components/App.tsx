/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

import Progress from "./Progress";
import TemplateTreeView from "./TemplateTreeView";
import { useGetVariables } from "../hooks/useGetVariables";
import type { Node } from "../components/TemplateTreeView";
import ThemeProvider from "./ThemeProvider";
import { useGetCategories } from "../hooks/useGetCategories";
import { CategoryType } from "../types/categories";
import { CategoriesDropdown } from "./CategoriesDropdown";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = ({ title, isOfficeInitialized }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [currentCategory, setCurrentCategory] = useState({ id: 3, name: "quote" });
  const { getCategories } = useGetCategories();
  const { getVariables } = useGetVariables(currentCategory);
  const [availableVariables, setAvailableVariables] = useState<Node[]>([]);

  const updateCurrentCategory = (category: CategoryType) => {
    setCurrentCategory(category);
  };

  useEffect(() => {
    (async () => {
      try {
        const categories = await getCategories();

        if (!categories) {
          throw new Error(`Failed to retrieve categories`);
        }

        setCategories(categories);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const availableVariables = await getVariables();

        if (!availableVariables) {
          throw new Error(`Failed to retrieve available variables for type ${currentCategory.name}`);
        }

        setAvailableVariables(availableVariables);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentCategory]);

  if (!isOfficeInitialized) {
    return (
      <Progress
        title={title}
        logo={require("./../../../assets/logo-filled.png")}
        message="Please sideload your addin to see app body."
      />
    );
  }

  return (
    <ThemeProvider>
      <div className="wrapper">
        <CategoriesDropdown category={currentCategory} categories={categories} setCategory={updateCurrentCategory} />
        <TemplateTreeView
          title={<Typography variant="body1" sx={{ mb: 1, color: "text.secondary" }}>{`Variables`}</Typography>}
          sx={{ minWidth: 250 }}
          onItemClick={(variable) => {
            return Word.run(async (context) => {
              const paragraph = context.document.body.insertParagraph(variable, Word.InsertLocation.end);

              paragraph.font.color = "blue";

              await context.sync();
            });
          }}
          nodes={availableVariables}
          format="docx"
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
