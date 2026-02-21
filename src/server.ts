import { app } from "./app.js";
import { loadData } from "./storage/store.js";

const PORT = 8080;

try {
  loadData();
  console.log("Data loaded from file successfully");
} catch (error) {
  console.error("Error loading data from file:", error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
