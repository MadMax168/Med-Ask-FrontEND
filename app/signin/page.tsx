import { User, Key } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
  

export default function SIGNIN() {
    return (
        <main className="h-screen w-screen">
            <div className="h-full flex justify-center items-center">
                <form className="h-1/2 w-[500px]">
                    <Card className="h-auto w-full p-2">
                        <CardHeader>
                            <CardTitle className="text-xl text-center text-slate-800 font-extrabold">
                                SIGNIN
                            </CardTitle>
                        </CardHeader>
                        <hr className="m-3" />
                        <br />
                        <CardContent>
                            <div>
                                <CardTitle className="flex gap-2 text-md text-slate-800">
                                    <User />
                                    : USERNAME
                                </CardTitle>
                                <br />
                                <div className="h-10">
                                    <Input type="text" placeholder="username" />
                                </div>
                            </div>
                            <br />
                            <div>
                                <CardTitle className="flex gap-2 text-md text-slate-800">
                                    <Key />
                                    : PASSWORD
                                </CardTitle>
                                <br />
                                <div className="h-10">
                                    <Input type="password" placeholder="password" />
                                    <a href="" className="text-right text-red-700 text-xs">*Forgot Password</a>
                                </div>
                            </div>
                        </CardContent>
                        <br />
                        <CardFooter>
                            <Button className="h-10 w-full bg-green-700">SUBMIT</Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </main>

    )
}