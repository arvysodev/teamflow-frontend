import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { verifyEmailRequest } from "@/features/auth/api/verifyEmail"
import { getProblemDetail } from "@/shared/api/problemDetails"

const schema = z.object({
  token: z.string().min(1, "Token is required"),
})

type FormValues = z.infer<typeof schema>

export function VerifyPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const email = params.get("email")

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { token: "" },
  })

  const mutation = useMutation({
    mutationFn: verifyEmailRequest,
    onSuccess: () => {
      toast.success("Email verified. You can now log in.")
      navigate("/login", { replace: true })
    },
    onError: (error) => {
      form.clearErrors()

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const pd = getProblemDetail(error.response?.data)
        const detail = pd?.detail

        if (status === 404 && detail === "Verification token is invalid.") {
          form.setError("token", { type: "server", message: "Token is invalid" })
          return
        }

        if (status === 400 && detail === "Verification token is invalid.") {
          form.setError("token", { type: "server", message: "Token is invalid" })
          return
        }

        if (status === 400 && detail === "Verification token has expired.") {
          form.setError("token", {
            type: "server",
            message: "Token has expired. Please register again.",
          })
          return
        }

        if (status === 409 && detail === "User is not in PENDING status.") {
          toast.message("This account is not pending verification.")
          return
        }

        toast.error("Verification failed", { description: detail ?? `Status: ${status}` })
        return
      }

      toast.error("Verification failed.")
    },
  })

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Verify email</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {email ? (
                <>
                  Paste the verification token for <span className="font-medium">{email}</span>.
                </>
              ) : (
                <>Paste the verification token from backend logs.</>
              )}
            </p>

            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="space-y-1">
                <label className="text-sm">Token</label>
                <Input placeholder="e.g. 8b1f..." {...form.register("token")} />
                {form.formState.errors.token && (
                  <p className="text-sm text-destructive">{form.formState.errors.token.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Verifying..." : "Verify"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              Back to{" "}
              <Link className="underline" to="/login">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
