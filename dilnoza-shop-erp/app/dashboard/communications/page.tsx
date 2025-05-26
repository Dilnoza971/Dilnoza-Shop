"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Send, Trash2, Mail, MailPlus, Reply, Forward, Archive } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Message } from "@/lib/supabase"

// Sample message data (would come from Supabase in production)
const messages: Message[] = [
  {
    id: "MSG-1001",
    sender: "Sarah Johnson",
    recipient: "Admin",
    subject: "Order #ORD-7245 Inquiry",
    content:
      "Hello, I wanted to check on the status of my order #ORD-7245. It's been a week since I placed it and I haven't received any shipping confirmation. Could you please provide an update? Thank you!",
    read: false,
    created_at: "2025-05-15T10:30:00Z",
  },
  {
    id: "MSG-1002",
    sender: "Admin",
    recipient: "Michael Brown",
    subject: "Your Recent Purchase",
    content:
      "Hi Michael, Thank you for your recent purchase! We wanted to follow up and make sure you're satisfied with your items. If you have any questions or concerns, please don't hesitate to reach out. Best regards, Dilnoza Shop Team",
    read: true,
    created_at: "2025-05-14T15:45:00Z",
  },
  {
    id: "MSG-1003",
    sender: "Emma Wilson",
    recipient: "Admin",
    subject: "Return Request",
    content:
      "Hello, I'd like to return one of the items from my recent order #ORD-7243. The size doesn't fit as expected. Could you please guide me through the return process? Thanks, Emma",
    read: false,
    created_at: "2025-05-14T09:15:00Z",
  },
  {
    id: "MSG-1004",
    sender: "Admin",
    recipient: "James Miller",
    subject: "Exclusive Offer for Loyal Customers",
    content:
      "Dear James, As one of our valued customers, we're excited to offer you an exclusive 20% discount on your next purchase. Use code LOYAL20 at checkout. This offer is valid for the next 7 days. Happy shopping! Dilnoza Shop Team",
    read: true,
    created_at: "2025-05-13T11:20:00Z",
  },
  {
    id: "MSG-1005",
    sender: "Olivia Davis",
    recipient: "Admin",
    subject: "Product Availability",
    content:
      "Hi there, I'm interested in the Women's Summer Dress that's currently out of stock. Do you know when it will be available again? I really want to purchase it for an upcoming event. Thanks, Olivia",
    read: true,
    created_at: "2025-05-12T14:10:00Z",
  },
  {
    id: "MSG-1006",
    sender: "Admin",
    recipient: "William Taylor",
    subject: "Order Confirmation #ORD-7240",
    content:
      "Dear William, Thank you for your order! This email confirms that we've received your order #ORD-7240. We'll send you another notification once your items have been shipped. If you have any questions, please don't hesitate to contact us. Best regards, Dilnoza Shop Team",
    read: true,
    created_at: "2025-05-11T16:30:00Z",
  },
  {
    id: "MSG-1007",
    sender: "Sophia Martinez",
    recipient: "Admin",
    subject: "Feedback on Recent Purchase",
    content:
      "Hello, I recently purchased several items from your store and I wanted to share my feedback. The quality of the products is excellent and the delivery was faster than expected! I'll definitely be shopping with you again. Best, Sophia",
    read: false,
    created_at: "2025-05-10T13:45:00Z",
  },
]

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState("inbox")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [composeMode, setComposeMode] = useState(false)
  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    content: "",
  })

  useEffect(() => {
    // Filter messages based on active tab and search term
    let filtered = messages

    // Filter by tab
    if (activeTab === "inbox") {
      filtered = filtered.filter((msg) => msg.recipient === "Admin")
    } else if (activeTab === "sent") {
      filtered = filtered.filter((msg) => msg.sender === "Admin")
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setFilteredMessages(filtered)
  }, [activeTab, searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    setComposeMode(false)

    // Mark as read if it's an incoming message
    if (message.recipient === "Admin" && !message.read) {
      // In a real app, this would update the database
      // For now, we'll just update the local state
      const updatedMessages = messages.map((msg) => (msg.id === message.id ? { ...msg, read: true } : msg))
      // This would be a Supabase update in production
    }
  }

  const handleCompose = () => {
    setSelectedMessage(null)
    setComposeMode(true)
    setNewMessage({
      recipient: "",
      subject: "",
      content: "",
    })
  }

  const handleSendMessage = () => {
    // In a real app, this would save to the database
    alert("Message sent successfully!")
    setComposeMode(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()

    // If the message is from today, show only the time
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }

    // Otherwise, show the date
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  return (
    <DashboardShell className="bg-black">
      <DashboardHeader
        heading="Communications"
        text="Manage customer messages and internal communications."
        className="text-white"
      >
        <Button className="gap-1 bg-pink-600 hover:bg-pink-700" onClick={handleCompose}>
          <MailPlus className="h-4 w-4" />
          <span>Compose</span>
        </Button>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-3">
          <Card className="bg-zinc-900 border-zinc-800 text-white h-full">
            <CardHeader className="pb-2">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8 w-full bg-zinc-800 border-zinc-700 text-white"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="inbox" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full bg-zinc-800 rounded-none justify-start">
                  <TabsTrigger
                    value="inbox"
                    className="flex-1 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                  >
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger
                    value="sent"
                    className="flex-1 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                  >
                    Sent
                  </TabsTrigger>
                </TabsList>

                <div className="mt-2 space-y-1 px-1">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded-md cursor-pointer ${
                        selectedMessage?.id === message.id ? "bg-zinc-800" : "hover:bg-zinc-800"
                      } ${message.recipient === "Admin" && !message.read ? "border-l-2 border-pink-500" : ""}`}
                      onClick={() => handleSelectMessage(message)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-zinc-700 text-zinc-300">
                            {getInitials(message.sender)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p
                              className={`text-sm font-medium truncate ${
                                message.recipient === "Admin" && !message.read
                                  ? "text-white font-semibold"
                                  : "text-zinc-300"
                              }`}
                            >
                              {activeTab === "inbox" ? message.sender : message.recipient}
                            </p>
                            <span className="text-xs text-zinc-500">{formatDate(message.created_at)}</span>
                          </div>
                          <p className="text-xs text-zinc-400 truncate">{message.subject}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9">
          <Card className="bg-zinc-900 border-zinc-800 text-white h-full">
            {selectedMessage ? (
              <>
                <CardHeader className="border-b border-zinc-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{selectedMessage.subject}</CardTitle>
                      <CardDescription className="text-zinc-400 mt-1">
                        From: {selectedMessage.sender} • To: {selectedMessage.recipient} •
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Forward className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-zinc-300 whitespace-pre-line">{selectedMessage.content}</div>
                </CardContent>
                <CardFooter className="border-t border-zinc-800 flex justify-end">
                  <Button className="gap-1 bg-pink-600 hover:bg-pink-700">
                    <Reply className="h-4 w-4" />
                    <span>Reply</span>
                  </Button>
                </CardFooter>
              </>
            ) : composeMode ? (
              <>
                <CardHeader className="border-b border-zinc-800">
                  <CardTitle className="text-white">New Message</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>To:</Label>
                    <Select>
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="sarah" className="focus:bg-zinc-800 focus:text-white">
                          Sarah Johnson
                        </SelectItem>
                        <SelectItem value="michael" className="focus:bg-zinc-800 focus:text-white">
                          Michael Brown
                        </SelectItem>
                        <SelectItem value="emma" className="focus:bg-zinc-800 focus:text-white">
                          Emma Wilson
                        </SelectItem>
                        <SelectItem value="james" className="focus:bg-zinc-800 focus:text-white">
                          James Miller
                        </SelectItem>
                        <SelectItem value="olivia" className="focus:bg-zinc-800 focus:text-white">
                          Olivia Davis
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject:</Label>
                    <Input
                      placeholder="Message subject"
                      className="bg-zinc-800 border-zinc-700 text-white"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message:</Label>
                    <Textarea
                      placeholder="Type your message here..."
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[200px]"
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-zinc-800 flex justify-between">
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={() => setComposeMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="gap-1 bg-pink-600 hover:bg-pink-700" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </Button>
                </CardFooter>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-zinc-500">
                <Mail className="h-16 w-16 mb-4" />
                <p className="text-lg">Select a message to view or compose a new one</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium text-zinc-400">{children}</div>
}
