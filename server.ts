import express from "express";
import cors from "cors";
import data from "./data/data.ts";

const app = express();
app.use(cors());
app.use(express.json());

const ROOT_NODE_ID = "root";

type ItemType = "folder" | "file";

type Node = {
  id?: string;
  type: ItemType;
  children?: Record<string, Node>;
};

type FlatNode = {
  id: string;
  type: ItemType;
  childrenIds: Array<string> | undefined;
};

type resultFlatNodes = {
  flatNodes: Array<FlatNode> | null;
  depthLevel: number;
} | null;

function getNodeById(node: Node, id: string): Node | null {
  if (!node) return null;

  let result: resultFlatNodes = null;
  let flatNodes: Array<FlatNode> = [];
  let depthLevel = 0;

  if (!id || id === ROOT_NODE_ID) {
    // console.log("ROOT NODE: ", node);
    flatNodes = Object.entries(node).map(([key, value]) => ({
      id: key,
      type: value.type,
      childrenIds: value.children ? Object.keys(value.children) : undefined,
    }));
    depthLevel = 1;

    result = {
      flatNodes,
      depthLevel,
    };

    return result;
  }

  for (const key in node) {
    console.log("node: ", node);

    if (key === id) {
      console.log("key: ", key);

      flatNodes = Object.entries(node[key].children ?? {}).map(
        ([childKey, childValue]) => ({
          id: childKey,
          type: childValue.type,
          childrenIds: childValue.children
            ? Object.keys(childValue.children)
            : undefined,
        }),
      );

      depthLevel += 1;

      result = {
        flatNodes,
        depthLevel,
      };

      console.log("result: ", result);
      return result;
    }
  }
  return null;
}

app.get("/", (req, res) => {
  res.send("Server is running. Try /api/data");
});

app.get("/api/data", (req, res) => {
  const node = getNodeById(data.root);
  res.json({
    flatNodes: node?.flatNodes ?? [],
    depthLevel: node?.depthLevel ?? 0,
  });
});

app.get("/api/data/:id", (req, res) => {
  const { id } = req.params;

  const node = getNodeById(data.root, id);
  // console.log("NODE: ", node);
  res.json({
    flatNodes: node?.flatNodes ?? [],
    depthLevel: node?.depthLevel ?? 0,
  });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
