/* eslint-disable */
import React, { useEffect, useState } from "react";
import { DefaultButton } from "@fluentui/react";
import Progress from "./Progress";
import TemplateTreeView from "./TemplateTreeView";
import { Typography } from "@mui/material";
import {quoteVariables} from "./test";
import { useGetVariables } from "../hooks/useGetVariables";
import type { Node } from "../components/TemplateTreeView";

/* global Word, require */



export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = (props) => {

  const category = {
    id: 3,
    name: "quote",
  }
  const { getVariables } = useGetVariables(category);
  const [availableVariables, setAvailableVariables] = useState<Node[]>([]);

  const { title, isOfficeInitialized } = props;
  useEffect(() => {(async () => {
    try {
      const availableVariables = await getVariables();
      if (!availableVariables) {
        throw new Error(`Failed to retrieve available variables for type ${category.name}`);
      }
      console.log(JSON.stringify(availableVariables))
      setAvailableVariables(availableVariables);
    } catch (error) {
      console.error(error);
    }
  })()}, [])

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
            const paragraph = context.document.body.insertParagraph(
              variable,
              Word.InsertLocation.end
            );
            await context.sync();
          });
        }}
        nodes={quoteVariables}
        format="docx"
      />
    </div>
  );
};

export default App;
