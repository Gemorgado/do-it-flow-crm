import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "./AuthProvider";
import { Loader } from "lucide-react";
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().optional()
});
type LoginFormData = z.infer<typeof loginSchema>;
export default function LoginPage() {
  const {
    login
  } = useAuth();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });
  const {
    isSubmitting
  } = form.formState;

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("auth-email");
    const savedPassword = localStorage.getItem("auth-password");
    const savedRememberMe = localStorage.getItem("auth-remember-me") === "true";
    if (savedEmail && savedPassword && savedRememberMe) {
      form.setValue("email", savedEmail);
      form.setValue("password", savedPassword);
      form.setValue("rememberMe", true);
    }
  }, [form]);
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Save or remove credentials based on rememberMe
      if (data.rememberMe) {
        localStorage.setItem("auth-email", data.email);
        localStorage.setItem("auth-password", data.password);
        localStorage.setItem("auth-remember-me", "true");
      } else {
        localStorage.removeItem("auth-email");
        localStorage.removeItem("auth-password");
        localStorage.removeItem("auth-remember-me");
      }
      await login(data as LoginCredentials);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <Card className="w-full max-w-sm shadow-lg border border-gray-200" style={{
      opacity: 1
    }}>
        <CardHeader className="space-y-1 text-center" style={{
        opacity: 1
      }}>
          <div className="flex justify-center mb-2" style={{
          opacity: 1
        }}>
            <img src="./do-it-logo.png" alt="Do It Hub Logo" className="h-10" style={{
            opacity: 1
          }} onError={e => {
            console.error("Erro ao carregar a logo");
            e.currentTarget.style.display = 'none';
          }} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800" style={{
          opacity: 1
        }}>Do It Hub</CardTitle>
        </CardHeader>
        
        <CardContent style={{
        opacity: 1
      }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" style={{
            opacity: 1
          }}>
              <FormField control={form.control} name="email" render={({
              field
            }) => <FormItem style={{
              opacity: 1
            }}>
                    <FormLabel className="text-gray-700" style={{
                opacity: 1
              }}>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" autoComplete="email" aria-label="Email" className="bg-white text-gray-800" {...field} style={{
                  opacity: 1
                }} />
                    </FormControl>
                    <FormMessage className="text-red-600" style={{
                opacity: 1
              }} />
                  </FormItem>} />
              
              <FormField control={form.control} name="password" render={({
              field
            }) => <FormItem style={{
              opacity: 1
            }}>
                    <FormLabel className="text-gray-700" style={{
                opacity: 1
              }}>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" aria-label="Senha" autoComplete="current-password" className="bg-white text-gray-800" {...field} style={{
                  opacity: 1
                }} />
                    </FormControl>
                    <FormMessage className="text-red-600" style={{
                opacity: 1
              }} />
                  </FormItem>} />
              
              <FormField control={form.control} name="rememberMe" render={({
              field
            }) => <FormItem className="flex flex-row items-center space-x-2 space-y-0" style={{
              opacity: 1
            }}>
                    <FormControl>
                      <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} style={{
                  opacity: 1
                }} />
                    </FormControl>
                    <FormLabel htmlFor="rememberMe" className="text-sm font-normal cursor-pointer text-gray-700" style={{
                opacity: 1
              }}>
                      Lembrar-me
                    </FormLabel>
                  </FormItem>} />
              
              <Button type="submit" disabled={isSubmitting} style={{
              opacity: 1,
              color: "white !important"
            }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-slate-950">
                {isSubmitting ? <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                  </> : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="justify-center text-sm" style={{
        opacity: 1
      }}>
          <p className="text-gray-600" style={{
          opacity: 1
        }}>Use admin@doitflow.com / 123456 para teste</p>
        </CardFooter>
      </Card>
    </div>;
}