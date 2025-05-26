"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
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
import { registerFormFields, registerFormSchema } from "@/api/auth/schema";
import { useAuthRegister } from "@/api/auth/mutation";
import AuthLayout from "@/components/templates/layout/auth-layout";

export default function RegisterForm() {
  const { mutate: register, isPending } = useAuthRegister();

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
      type: "public",
      accepted_terms: "true",
    },
  });

  const onSubmit = (data: z.infer<typeof registerFormSchema>) => {
    register(data);
  };

  return (
    <AuthLayout
      title="Register"
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {registerFormFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: fieldProps }) => (
                <FormItem className={field.hidden ? "hidden" : undefined}>
                  {!field.hidden && <FormLabel>{field.label}</FormLabel>}
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type={field.type}
                      required={field.required}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
