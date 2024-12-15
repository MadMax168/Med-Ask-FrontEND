
"use client"

import { SearchBox, DataTable, JSONReader, fetchEHR } from "@/components/docfunc"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";

export default function doc(){
  const [EHR_data, setEHR_data] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data: any = await fetchEHR();
      console.log(data)
      setEHR_data(data);
    }
    fetchData();
  }, []);

  return (
    <main className="w-screen h-screen p-7 flex flex-row">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="w-full h-[70px] pl-20 flex items-center">
          <h1>[username]</h1> {/* Link with database(user) */}
        </div>
        <div className="w-full h-auto p-2"> {/* Search form */}
          <SearchBox />
        </div>
        <div className="w-full h-1/2 p-2"> {/* Data Table */}
          <DataTable />
        </div>
      </div>
      <div className="w-1/2 h-full"> {/* Summary*/}
        <div className="w-full p-2">
          <JSONReader ehr_data={EHR_data} />
        </div>
        <div className="w-full h-auto p-2"> {/* Advice form */}
          <div className="w-full h-full p-4 flex flex-col justify-between bg-white border rounded-xl shadow-md">
            <div className="h-4/5">
              <Textarea placeholder="เห็นว่า..." />
            </div>
            <Button className="w-full h-[50px] text-xl bg-green-700">SUBMIT</Button>
          </div>
        </div>
      </div>
    </main>
  )
}