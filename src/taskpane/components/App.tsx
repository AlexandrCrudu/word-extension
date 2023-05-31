/* eslint-disable */
import React from "react";
import { DefaultButton } from "@fluentui/react";
import Progress from "./Progress";

/* global Word, require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = (props) => {
  const dbfields = [
    "CreatedAt",
    "CreatedBy",
    "Discount",
    "Draft",
    "Due Data",
    "Name",
    "Tax Rate",
    "bla bla",
    "more fields",
  ];
  const click = async () => {
    return Word.run(async (context) => {
      const paragraph = context.document.body.insertParagraph(
        "You can also interact with the actual word page from the pane. How cool is that :) So yes, it is not very hard to implement this task, it is definitely doable. ",
        Word.InsertLocation.end
      );

      paragraph.font.color = "blue";

      await context.sync();
    });
  };

  const { title, isOfficeInitialized } = props;

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
      <h1 className="title">OPUSFLOW ROCKS</h1>
      {dbfields.map((field) => {
        return <li className="item">{field}</li>;
      })}
      <DefaultButton className="messageBtn" onClick={click}>
        Click to read cool message from Alex
      </DefaultButton>
    </div>
  );
};

export default App;
