import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import data from "./data/data";

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

// Traverse by folderPath
function getNodeByPath(
  node: Node,
  path: string[],
): { node: Node | null; depthLevel: number } {
  let current = node;

  // Depth level starts at 1 for the root node, and increments for each folder in the path
  // I created it for easy debug, and left for future UI improvements (e.g. showing depth level in the UI)
  let depthLevel = 1;
  for (const key of path) {
    if (!current.children || !current.children[key]) {
      return { node: null, depthLevel };
    }
    current = current.children[key];
    depthLevel++;
  }
  return { node: current, depthLevel };
}

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running. Try /api/data");
});

// Root: return first-level children
app.get("/api/data", (req: Request, res: Response) => {
  const flatNodes: FlatNode[] = Object.entries(data.root).map(
    ([key, value]) => ({
      id: key,
      type: value.type as ItemType,
      childrenIds: value.children ? Object.keys(value.children) : undefined,
    }),
  );
  res.json({ flatNodes, depthLevel: 1 });
});

// Nested path: return children and depth level of the specified folder
app.get("/api/data/*id", (req: Request, res: Response) => {
  const raw = req.params.id;
  const path = Array.isArray(raw)
    ? raw.flatMap((s: string) => s.split("/")).filter(Boolean)
    : raw
      ? String(raw).split("/").filter(Boolean)
      : [];

  const rootNode: Node = {
    type: "folder",
    children: data.root as Record<string, Node>,
  };
  const { node, depthLevel } = getNodeByPath(rootNode, path);
  if (!node) {
    return res.status(404).json({ error: "Not found" });
  }
  const flatNodes: FlatNode[] = node.children
    ? Object.entries(node.children).map(([key, value]) => ({
        id: key,
        type: value.type as ItemType,
        childrenIds: value.children ? Object.keys(value.children) : undefined,
      }))
    : [];
  res.json({ flatNodes, depthLevel });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
