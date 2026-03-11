import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginRequest } from "@/features/auth/api/login"
import { useAuth } from "@/features/auth/model/AuthContext"
import { getProblemDetail } from "@/shared/api/problemDetails"

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const { login } = useAuth()

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.accessToken)
      toast.success("Logged in")
      navigate("/", { replace: true })
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const pd = getProblemDetail(error.response?.data)
        const detail = pd?.detail

        if (status === 400 && detail === "Invalid credentials.") {
          toast.error("Invalid email or password.")
          return
        }

        if (status === 409 && detail === "Email is not verified.") {
          const email = form.getValues("email")
          toast.message("Please verify your email first.")
          navigate(`/verify?email=${encodeURIComponent(email)}`, { replace: true })
          return
        }

        if (status === 409 && detail === "User is disabled.") {
          toast.error("User is disabled.")
          return
        }

        toast.error("Login failed. Check email/password.")
        return
      }

      toast.error("Login failed.")
    },
  })

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="space-y-1">
                <label className="text-sm">Email</label>
                <Input type="email" autoComplete="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm">Password</label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-sm text-muted-foreground">
                No account?{" "}
                <Link className="underline" to="/register">
                  Register
                </Link>
              </p>

              <p className="text-sm text-muted-foreground">
                Have verification token?{" "}
                <Link className="underline" to="/verify">
                  Verify Eemail
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
