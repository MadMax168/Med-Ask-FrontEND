import { ChatBox } from "@/components/chat";

export default function PMM({ params } : {params: { queue_id: string };}) {
    return (
        <main className="h-screen w-screen">
            <div className="h-[75px] w-full flex items-center">
                <div className="text-4xl font-bold ml-20 text-blue-700">{params.queue_id}</div>
            </div>
            <div className="h-full w-full flex">
                <div className="h-full w-3/5 pt-10 flex justify-center">
                    <ChatBox />
                </div>
                <div className="h-full w-2/5 flex justify-center items-center">
                    avatar
                </div>
            </div>
        </main>
    )
}