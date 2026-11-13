import { useLocation, useNavigate } from "react-router-dom"
import { LogOut, Settings, Pill, House, Syringe, ListTodo } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth.context"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function HeaderLateral() {
    const { usuario, logout } = useAuth()
    const { state } = useSidebar()

    const location = useLocation()
    const navigate = useNavigate()
    const currentPath = location.pathname

    const menuItems = [
        {
            label: "Principal",
            path: "/principal",
            icon: House,
        },
        {
            label: "Remédios",
            path: "/remedio",
            icon: Pill,
        },
        {
            label: "Alergias",
            path: "/alergia",
            icon: Syringe,
        },
        {
            label: "Tarefas",
            path: "/tarefa",
            icon: ListTodo,
        },
    ]

    const handleLogout = async () => {
        await window.api.auth.logout()
        logout()
        navigate("/")
    }

    const handleNavigate = (path: string) => {
        navigate(path)
    }

    const iniciais =
        usuario?.nome
            ?.split(" ")
            .map((parte) => parte[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U"

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-gray-200">
                <div className={cn(
                    "flex items-center gap-2 p-4",
                    state === "collapsed" && "justify-center"
                )}>
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                            D
                        </span>
                    </div>

                    {state === "expanded" && (
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-xl text-slate-800 tracking-tight">
                                Dosely
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                Sistema de saúde
                            </span>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
                <SidebarGroup>
                    <SidebarGroupLabel className={cn(
                        "px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider",
                        state === "collapsed" && "sr-only"
                    )}>
                        Menu
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = currentPath === item.path

                                return (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                        >
                                            <button
                                                onClick={() => handleNavigate(item.path)}
                                                className="w-full flex items-center gap-3"
                                            >
                                                <Icon className="h-5 w-5 flex-shrink-0" />
                                                <span>{item.label}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-200 p-4">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton asChild>
                            <button className="flex items-center gap-3 w-full">
                                <Avatar className="h-10 w-10 border-2 border-gray-200 flex-shrink-0">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-semibold text-base">
                                        {iniciais}
                                    </AvatarFallback>
                                </Avatar>

                                {state === "expanded" && (
                                    <div className="flex flex-col items-start min-w-0 ml-3">
                                        <span className="font-semibold text-slate-800 truncate">
                                            {usuario?.nome || ""}
                                        </span>

                                        <span className="text-xs text-slate-500 truncate">
                                            {usuario?.email || ""}
                                        </span>
                                    </div>
                                )}
                            </button>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-64"
                        align="end"
                        side="right"
                        sideOffset={12}
                    >
                        <DropdownMenuLabel className="font-normal p-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-semibold text-slate-800">
                                    {usuario?.nome || ""}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {usuario?.email || ""}
                                </p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={() => navigate("/configuracoes")}
                            className="cursor-pointer py-2.5"
                        >
                            <Settings className="mr-3 h-4 w-4 text-slate-500" />
                            <span>Configurações</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer py-2.5"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}