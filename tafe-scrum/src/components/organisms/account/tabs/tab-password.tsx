"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound, LoaderCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChangePassword } from "@/api/user/mutation";
import { passwordFormFields, passwordFormSchema } from "@/api/user/schema";
import { z } from "zod";

export default function TabPassword() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    if (values.password !== values.password_confirmation) {
      form.setError("password_confirmation", {
        message: "Passwords don't match",
      });
      return;
    }

    changePassword({
      current_password: values.current_password,
      password: values.password,
      password_confirmation: values.password_confirmation,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {passwordFormFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: fieldProps }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center">
                      <KeyRound size={16} />
                      {field.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        required={field.required}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        {...fieldProps}
                      />
                    </FormControl>
                    {field.name === "current_password" && (
                      <p className="text-xs text-muted-foreground">
                        Enter your current password for verification.
                      </p>
                    )}
                    {field.name === "password" && (
                      <p className="text-xs text-muted-foreground">
                        Choose a strong password with at least 8 characters.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className={"w-full sm:w-max"}
              >
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
