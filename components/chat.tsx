import { Card } from "@/components/ui/card"
import { FileX } from "lucide-react"

export function ChatBox() {
    return (
        <div className="h-full w-4/5 border rounded-xl p-4 overflow-y-auto bg-white">
            
            <Card className="h-[50px] w-[50px] flex justify-center items-center">
                <div className="h-4/5 w-4/5 border rounded-full">
                    <img src="" />
                </div>
            </Card>
        </div>
    )
}