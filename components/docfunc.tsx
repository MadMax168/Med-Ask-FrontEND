import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EHRData } from "@/typing/ehrdata";

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
  const processItem = (key: string, value: any) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      output.push(`${key}:`);
      output.push(...readJson(value));
    } else if (Array.isArray(value)) {
      output.push(
        `${key}: [${value
          .map((item: any) =>
            typeof item === "object"
              ? `{ ${Object.entries(item)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")} }`
              : item
          )
          .join(", ")}]`
      );
    } else {
      output.push(`${key}: ${value}`);
    }
  };

  if (data && typeof data === "object") {
    Object.entries(data).forEach(([key, value]) => processItem(key, value));
  }
  return output;
};

// import fs from "fs";
// export const loadTestEHRData = () => {
//   try {
//     const filePath = path.join(process.cwd(), "public", "test.json");
//     const fileContents = fs.readFileSync(filePath, "utf8");
//     return JSON.parse(fileContents);
//   } catch (error) {
//     console.error("Error reading or parsing JSON file:", error);
//     return null;
//   }
// };

export async function fetchEHR() {
  // Fetch the API data
  const response = await fetch(
    "https://microhum-mali-nurse-rest-api.hf.space/details"
  );
  const data = await response.json();

  return {
    ehrData: data.ehr_data,
  };
}

const ehrDataThaiTranslation: { [key: string]: string } = {
  ehrData: "ข้อมูลของคนไข้",
  name: "ชื่อ",
  prefix: "คำนำหน้า",
  firstname: "ชื่อจริง",
  surname: "นามสกุล",
  age: "อายุ",
  gender: "เพศ",
  chief_complaint: "อาการสำคัญ",
  present_illness: "ประวัติการเจ็บป่วยปัจจุบัน",
  past_illness: "ประวัติการเจ็บป่วยในอดีต",
  family_history: "ประวัติครอบครัว",
  relation: "ความสัมพันธ์",
  condition: "ภาวะโรค",
  personal_history: "ประวัติส่วนตัว",
  type: "ประเภท",
  description: "รายละเอียด"
};

function mapEHRParameter(input: string): string {
  // Extract the key name before the colon
  const keyMatch = input.match(/^([\w_]+):/);
  if (!keyMatch) {
    throw new Error("Invalid input format");
  }
  const key = keyMatch[1];
  const thaiTranslation = ehrDataThaiTranslation[key];
  
  if (!thaiTranslation) {
    throw new Error(`No translation found for parameter: ${key}`);
  }
  return input.replace(key, thaiTranslation);
}

export const JSONReader: React.FC<{ ehr_data: EHRData }> = ({ ehr_data }) => {
  const processedData = ehr_data ? readJson(ehr_data) : [];
  return (
    <div className="h-full w-full">
      <hr />
      <div className="grid grid-cols-2 gap-4 bg-white p-4 border rounded-lg shadow-md overflow-y-auto h-full max-h-[500px]">
        {processedData.length > 0 ? (
          processedData.map((item, index) => (
            <p
              key={index}
              className="text-base font-mono border p-2 rounded-lg shadow-md"
            >
              {mapEHRParameter(item)}
            </p>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};
