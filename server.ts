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

  if (id === ROOT_NODE_ID) {
    flatNodes = Object.entries(node).map(([key, value]) => ({
      id: key,
      type: value.type,
    }));
    depthLevel = 1;

    result = {
      flatNodes,
      depthLevel,
    };

    console.log("ROOT NODE: !!XX!! ", result);
    return result;
  }

  for (const key in node) {
    if (key === id) {
      return node[key];
    }
  }
  return "cannot find node by id";
}

app.get("/", (req, res) => {
  res.send("Server is running. Try /api/data");
});

app.get("/api/data", (req, res) => {
  res.json(data);
});

app.get("/api/data/:id", (req, res) => {
  const { id } = req.params;

  const node = getNodeById(data.root, id);
  console.log("NODE: ", node);
  res.json(node?.flatNodes ?? []);
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
