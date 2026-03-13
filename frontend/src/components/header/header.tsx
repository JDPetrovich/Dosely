import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLocation, useNavigate } from "react-router-dom"
//import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings } from "lucide-react"

export function Header() {
    //const [showWarn, setShowWarn] = useState(false)
    //const [nextPath, setNextPath] = useState<string | null>(null)

    const menuItems = [
        { label: "Principal", path: "/principal" },
       /*  { label: "Teste", path: "/teste" }, */
        { label: "Remédios", path: "/remedio" },
    ]

    const location = useLocation()
    const navigate = useNavigate()
    const currentPath = location.pathname

    const handleNavigate = (path: string) => {
        /* const isLeavingImportacao = currentPath === "/principal" && path !== "/principal"
        const dadosTemp = JSON.parse(sessionStorage.getItem("import-temp") || "[]")

        if (isLeavingImportacao && Array.isArray(dadosTemp) && dadosTemp.length > 0) {
            setNextPath(path)
            setShowWarn(true)
            return
        } */
        navigate(path)
    }

    return (
        <header className="bg-white/80  border-b border-gray-200 px-6 h-16 mb-3">
            <div className="max-w-7xl mx-auto h-full grid grid-cols-3 items-center">

                <div className="flex justify-start items-center gap-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <span className="font-bold text-xl text-slate-800">MedControll</span>
                </div>

                <nav className="flex items-center justify-center gap-2">
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            variant="ghost"
                            className={cn(
                                "text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl font-medium transition-all",
                                currentPath === item.path && "text-teal-700 bg-teal-100"
                            )}
                            onClick={() => handleNavigate(item.path)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </nav>

                <div className="flex justify-end">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-teal-100 hover:bg-teal-50">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="bg-teal-500 text-white">JD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 mt-2" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">Usuário</p>
                                    <p className="text-xs text-muted-foreground italic">usuario@email.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                                <span>Configurações</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                onClick={() => console.log("Sair")}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}