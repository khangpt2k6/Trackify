"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X } from "lucide-react"

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "👋 Hi there! I'm your financial assistant. How can I help you today?", isUser: false },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (!input.trim()) return
    
    // Add user message
    setMessages([...messages, { text: input, isUser: true }])
    
    // Clear input
    setInput("")
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "I can help you track your expenses more effectively!",
        "Try categorizing your expenses for better insights.",
        "Setting a budget for each category can help you save more.",
        "Need help with a specific expense category?",
        "Remember to add all your expenses to get accurate reports."
      ]
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      setMessages(prev => [...prev, { text: randomResponse, isUser: false }])
    }, 1000)
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96"
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.3 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Finance Assistant</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 h-80 overflow-y-auto flex flex-col space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index % 3) }}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          message.isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="p-3 border-t flex space-x-2">
                <Input
                  className="bg-background"
                  placeholder="Ask me about your finances..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 