import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { registerRequest } from "@/features/auth/api/register"

const usernameRegex = /^[a-z0-9._-]{3,50}$/

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .regex(usernameRegex, "Use lowercase letters, numbers, dot, underscore or hyphen"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", email: "", password: "" },
  })

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      toast.success("Account created. Please verify your email.")
      navigate(`/verify?email=${encodeURIComponent(form.getValues("email"))}`, { replace: true })
    },
    onError: () => {
      toast.error("Registration failed.")
    },
  })

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create an account to start using TeamFlow
            </p>

            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="space-y-1">
                <label className="text-sm">Username</label>
                <Input
                  autoComplete="username"
                  placeholder="e.g. artjom.v"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm">Email</label>
                <Input type="email" autoComplete="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm">Password</label>
                <Input type="password" autoComplete="new-password" {...form.register("password")} />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create account"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              Already have and account?{" "}
              <Link className="underline" to={"/login"}>
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
