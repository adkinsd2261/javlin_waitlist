import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Brain, Shield, Link, Users, CheckCircle, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Logo from "@/components/logo";

const waitlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
  source: z.string().default("waitlist"),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

export default function Waitlist() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      source: "waitlist",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Welcome to the waitlist!",
        description: `You're #${data.position} in line. We'll notify you when we launch!`,
      });
    },
    onError: (error: Error) => {
      const message = error.message.includes("409") 
        ? "You're already on our waitlist! We'll be in touch soon."
        : error.message.includes("400")
        ? "Please check your information and try again."
        : "Something went wrong. Please try again.";
      
      toast({
        title: "Oops!",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WaitlistFormData) => {
    waitlistMutation.mutate(data);
  };

  return (
    <div className="gradient-bg font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
          </div>
        </div>
      </nav>

      <div className="min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          {/* Hero Section */}
          <section className="text-center py-20 lg:py-32">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-semibold text-white leading-tight tracking-tight">
                Javlin: The AI Co-founder for{" "}
                <span className="text-gradient-javlin">Next-Gen Founders</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed">
                The first platform that remembers your best solutions, warns you about past mistakes, 
                and grows smarter with every project.
              </p>
              
              <div className="pt-4">
                <Button 
                  onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="electric-blue text-white font-medium text-lg px-8 py-4 rounded-2xl border-0 hover:opacity-90 transition-all duration-200"
                >
                  Join the Waitlist
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="grid gap-8 lg:gap-12">
              {[
                {
                  icon: <Brain className="w-8 h-8 text-blue-400" />,
                  title: "MemoryOS",
                  description: "Proactive, intelligent memory brain that learns from your decisions and surfaces insights when you need them most."
                },
                {
                  icon: <Link className="w-8 h-8 text-blue-400" />,
                  title: "Cross-Project Intelligence", 
                  description: "Learns from all your projects. Solutions from Project Alpha automatically help with Project Beta when context matches."
                },
                {
                  icon: <Users className="w-8 h-8 text-blue-400" />,
                  title: "Personal Co-founder",
                  description: "Context-aware, adaptive support that acts as your strategic partner, not just an assistant."
                },
                {
                  icon: <Shield className="w-8 h-8 text-blue-400" />,
                  title: "Control & Privacy",
                  description: "Your data, always yours. Review, edit, and delete any memory. Export anytime, on any plan. No lock-in, ever."
                }
              ].map((feature, index) => (
                <Card key={index} className="gradient-card rounded-2xl p-8 border-0">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-medium text-white">{feature.title}</h3>
                        <p className="text-lg text-gray-300 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Waitlist Form Section */}
          <section id="waitlist-form" className="py-20">
            <Card className="gradient-card rounded-3xl p-8 lg:p-12 border-0 max-w-2xl mx-auto">
              <CardContent className="p-0">
                {isSuccess ? (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-medium text-white">You're on the list!</h3>
                      <p className="text-lg text-gray-300">
                        We'll notify you as soon as Javlin.ai is ready for early access.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-center space-y-3">
                      <h2 className="text-3xl font-medium text-white">Join the Waitlist</h2>
                      <p className="text-lg text-gray-300">
                        Be among the first to experience the future of AI-powered development.
                      </p>
                    </div>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-white font-medium text-base">Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your full name"
                                  className="input-focus bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl px-4 py-3 text-base"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-white font-medium text-base">Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  className="input-focus bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl px-4 py-3 text-base"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-white font-medium text-base">
                                What would you want your AI cofounder to remember for you?
                                <span className="text-gray-400 font-normal ml-1">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., My coding patterns, past project mistakes, successful strategies..."
                                  className="input-focus bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl px-4 py-3 text-base min-h-[100px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button
                          type="submit"
                          disabled={waitlistMutation.isPending}
                          className="electric-blue w-full text-white font-medium text-lg py-4 rounded-xl border-0 hover:opacity-90 transition-all duration-200"
                        >
                          {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Founders Badge Section */}
          <section className="py-16">
            <Card className="gradient-card rounded-3xl p-8 lg:p-12 border border-yellow-500/20 max-w-3xl mx-auto">
              <CardContent className="p-0">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-medium text-white">Founders' Special</h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      First 1,000 signups get <span className="text-yellow-400 font-medium">30% off Pro or Premium for life</span> and an exclusive Founders badge.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="py-16 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Lock className="w-4 h-4" />
              <p className="text-base">
                Your data is safe, always exportable. No spam. Privacy-first.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}