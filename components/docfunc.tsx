import path from "path";
import fs from "fs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBox() {
  const searchlist = [
    {
      title: "Date",
      place: "DD/MM/YYYY",
    },
    {
      title: "Hospital",
      place: "Bangpakok1",
    },
    {
      title: "Queue",
      place: "A001",
    },
    {
      title: "Age",
      place: "XX",
    },
    {
      title: "Sex",
      place: "Male",
    },
  ];

  return (
    <form
      action=""
      className="bg-white w-full h-full p-4 border rounded-xl shadow-md"
    >
      {searchlist.map((searchlist) => (
        <div
          key={searchlist.title}
          className="my-3 w-full flex gap-3 justify-between items-center"
        >
          <div className="text-xl font-bold">{searchlist.title} :</div>
          <div className="w-4/5">
            <Input type="text" placeholder={searchlist.place} />
          </div>
        </div>
      ))}
      <hr />
      <br />
      <Button className="w-full h-[50px] text-xl bg-green-700">Search</Button>
    </form>
  );
}

{
  /* ---------------------- Data Table ---------------------- */
}

export function DataTable() {
  return (
    <div className="w-full h-full p-4 border rounded-xl shadow-md bg-white">
      Table
    </div>
  );
}

{
  /* ---------------------- .JSON Reader ---------------------- */
}

const readJson = (data: any): string[] => {
  const output: string[] = [];
  for (const key in data) {
    if (typeof data[key] === "object" && !Array.isArray(data[key])) {
      output.push(`${key}:`);
      output.push(...readJson(data[key]));
    } else if (Array.isArray(data[key])) {
      output.push(`${key}: [${data[key].map((item: any) => 
        typeof item === "object" ? `{ ${Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(", ")} }` : item
      ).join(", ")}]`);
    } else {
      output.push(`${key}: ${data[key]}`);
    }
  }
  return output;
};

const JSONReader = async () => {
  let ehrData = null;

  try {
    const filePath = path.join(process.cwd(), "public", "test.json");
    {
      /* path.join(process.cwd(), "location", "filename.json") */
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileContents);

    ehrData = jsonData;
    console.log(ehrData);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return (
      <div className="bg-white h-full w-full p-4 border rounded-lg shadow-md">
        <p>Error loading data</p>
      </div>
    );
  }

  const processedData = ehrData ? readJson(ehrData) : [];

  return (
    <div className="h-full w-full">
      <h1 className="text-2xl font-bold mb-4">Summary</h1>
      <hr />
      <div className="bg-white p-4 border rounded-lg shadow-md overflow-y-auto h-full max-h-[500px]">
        {processedData.length > 0 ? (
          processedData.map((item, index) => (
            <p
              key={index}
              className="my-2 text-base font-mono border p-2 rounded-lg shadow-md"
            >
              {item}
            </p>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default JSONReader;
