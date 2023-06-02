import Iconify from "./Iconify";
import Scrollbar from "./Scrollbar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import type { TreeItemProps } from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import { Button, Divider, Stack, Tooltip, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { alpha, styled } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import type { TransitionProps } from "@mui/material/transitions";
import { useSpring, animated } from "@react-spring/web";
import * as React from "react";
import type { ReactNode } from "react";
// import { useTranslation } from "next-i18next";
// import type { TFunction } from "next-i18next";
import { v4 as uuid } from "uuid";

// import TemplateLegendInfoComponent from "../TemplateLegendInfoComponent";
import { generateEachLoop, generateVariable } from "../utils/extractVariables";

function TransitionComponent(props: TransitionProps) {
  const { in: propsIn } = props;
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: propsIn ? 1 : 0,
      transform: `translate3d(${propsIn ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export type Node = {
  key: string;
  label: string;
  children?: Node[];
  inArray?: boolean;
};

const renderTree = (
  nodes: Node,
  parentKeys: string[],
  onItemClick: (keyPath: string) => void,
  //   t: TFunction,
  format: "html" | "docx" | "raw"
) => {
  const currentKeys = [...parentKeys, nodes.key];
  const keyPath = currentKeys.join(".");
  const nodeId = uuid();
  return (
    <Stack key={keyPath} direction={"row"} justifyContent={"space-between"}>
      <StyledTreeItem
        ContentProps={{ style: { cursor: nodes.children ? "pointer" : "default" } }}
        sx={{ width: 1 }}
        nodeId={nodeId}
        label={nodes.label}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node, [...parentKeys, nodes.key], onItemClick, format))
          : null}
      </StyledTreeItem>
      {!nodes.children && (
        <Tooltip sx={{ background: "red" }} key={keyPath} arrow placement="left" title={""}>
          <Button
            onClick={() => {
              if (!nodes.children) {
                onItemClick(
                  nodes.inArray
                    ? generateEachLoop(parentKeys, nodes.key, format)
                    : generateVariable(parentKeys, nodes.key, format)
                );
              }
            }}
            sx={{
              p: 0,
            }}
          >
            <Iconify sx={{ width: 22, height: 22 }} icon={format === "html" ? "la:plus-square" : "la-copy"} />
          </Button>
        </Tooltip>
      )}
    </Stack>
  );
};

type Props = {
  title?: ReactNode;
  nodes: Node[];
  onItemClick: (keyPath: string) => void;
  sx?: SxProps;
  format: "html" | "docx" | "raw";
};

export default function TemplateTreeView({ title, nodes, onItemClick, sx, format }: Props) {
  //   const { t } = useTranslation("components");

  return (
    <Stack>
      <Stack direction={"row"} sx={{ width: 1 }} justifyContent={"space-between"}>
        {title ?? (
          <Typography sx={{ m: 1, pl: 1 }} variant="subtitle1">
            {/* {t("TemplateTreeView-legend")}{" "} */}
          </Typography>
        )}
        {/* {!!showInfo && <TemplateLegendInfoComponent context="pdf" />} */}
      </Stack>
      <Divider />
      <Scrollbar sx={{ overflowX: "hidden", m: 1, height: "fit-content", ...sx }}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={<div style={{ width: 18 }} />}
        >
          {nodes.map((node) => renderTree(node, [], onItemClick, format))}
        </TreeView>
      </Scrollbar>
    </Stack>
  );
}
