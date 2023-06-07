/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import Progress from "./Progress";
import TemplateTreeView from "./TemplateTreeView";
import { Typography } from "@mui/material";
import { quoteVariables } from "./test";
import { useGetVariables } from "../hooks/useGetVariables";
import type { Node } from "../components/TemplateTreeView";
import { useAuth, useClerk } from "@clerk/clerk-react";

/* global Word, require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = (props) => {
  
  //todo: let users choose a category
  const category = {
    id: 3,
    name: "quote",
  }
  
  const { getVariables } = useGetVariables(category);
  const { userId } = useAuth();
  const [availableVariables, setAvailableVariables] = useState<Node[]>([]);

  const { title, isOfficeInitialized } = props;

  useEffect(() => {
    (async () => {
      try {
        const availableVariables = await getVariables();
        if (!availableVariables) {
          throw new Error(`Failed to retrieve available variables for type ${category.name}`);
        }
        setAvailableVariables(availableVariables);
      } catch (error) {
        
      }
    })()
  }, [])

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
    <div className="wrapper">
      <TemplateTreeView title={<Typography variant="body1" sx={{ mb: 1, color: "text.secondary" }}>{`Variables`}</Typography>}
        sx={{ minWidth: 250 }}
        onItemClick={(variable) => {
          return Word.run(async (context) => {
            context.document.body.insertParagraph(
              variable,
              Word.InsertLocation.end
            );
            await context.sync();
          });
        }}
        nodes={availableVariables}
        format="docx"
      />
    </div>
  );
};

export default App;
