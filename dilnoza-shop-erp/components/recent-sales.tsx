import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>SJ</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sarah Johnson</p>
          <p className="text-sm text-muted-foreground">sarah.j@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$124.97</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>MB</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Michael Brown</p>
          <p className="text-sm text-muted-foreground">michael.b@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$49.99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>EW</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Emma Wilson</p>
          <p className="text-sm text-muted-foreground">emma.w@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$89.98</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>JM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">James Miller</p>
          <p className="text-sm text-muted-foreground">james.m@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$215.96</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>OD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Davis</p>
          <p className="text-sm text-muted-foreground">olivia.d@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$129.99</div>
      </div>
    </div>
  )
}
