"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AtSign,
  FileText,
  Mail,
  User,
  LoaderCircle,
  Trash2,
  Save,
} from "lucide-react";
import { useGetUserAuth } from "@/api/user/queries";
import { useEditUserInfo, useDeleteAccount } from "@/api/user/mutation";
import { profileFormFields, profileFormSchema } from "@/api/user/schema";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponseProps } from "@/api/base/global-type";
import { UserProps } from "@/api/user/type";
import { TabProfileSkeleton } from "@/components/atoms/skeleton/account/form/skeleton-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TabProfile() {
  const { data, isLoading, isError } = useGetUserAuth();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useEditUserInfo();
  const { mutate: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (data && !isLoading) {
      let userData: UserProps;

      if ("data" in data) {
        userData = (data as ResponseProps<UserProps>).data as UserProps;
      } else {
        userData = data as UserProps;
      }

      form.setValue("username", userData?.username || "");
      form.setValue("email", userData?.email || "");
      form.setValue("full_name", userData?.full_name || "");
      form.setValue("bio", userData?.bio || "");
    }
  }, [data, isLoading, form]);

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    if (!data) return;

    let userData: UserProps;

    if ("data" in data) {
      userData = (data as ResponseProps<UserProps>).data as UserProps;
    } else {
      userData = data as UserProps;
    }

    updateProfile({
      id: userData?.id,
      full_name: values.full_name,
      bio: values.bio,
    });
  };

  const handleDeleteAccount = () => {
    if (!data) return;

    let userData: UserProps;

    if ("data" in data) {
      userData = (data as ResponseProps<UserProps>).data as UserProps;
    } else {
      userData = data as UserProps;
    }

    if (userData?.id) {
      deleteAccount(userData.id.toString(), {});
    }
  };

  if (isLoading) {
    return <TabProfileSkeleton type="loading" />;
  }

  if (isError || !data) {
    return <TabProfileSkeleton type="error" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information and public profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {profileFormFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: fieldProps }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center">
                      {field.name === "username" && (
                        <AtSign size={16} className="mr-2" />
                      )}
                      {field.name === "email" && (
                        <Mail size={16} className="mr-2" />
                      )}
                      {field.name === "full_name" && (
                        <User size={16} className="mr-2" />
                      )}
                      {field.name === "bio" && (
                        <FileText size={16} className="mr-2" />
                      )}
                      {field.label}
                    </FormLabel>
                    <FormControl>
                      {field.type === "textarea" ? (
                        <Textarea
                          {...fieldProps}
                          disabled={
                            field.name === "username" || field.name === "email"
                          }
                          className={
                            field.name === "username" || field.name === "email"
                              ? "bg-muted"
                              : ""
                          }
                        />
                      ) : (
                        <Input
                          {...fieldProps}
                          disabled={
                            field.name === "username" || field.name === "email"
                          }
                          className={
                            field.name === "username" || field.name === "email"
                              ? "bg-muted"
                              : ""
                          }
                        />
                      )}
                    </FormControl>
                    {field.name === "username" && (
                      <p className="text-xs text-muted-foreground">
                        Your unique username (cannot be changed).
                      </p>
                    )}
                    {field.name === "email" && (
                      <p className="text-xs text-muted-foreground">
                        Your email address (cannot be changed).
                      </p>
                    )}
                    {field.name === "full_name" && (
                      <p className="text-xs text-muted-foreground">
                        Your full name displayed on your profile.
                      </p>
                    )}
                    {field.name === "bio" && (
                      <p className="text-xs text-muted-foreground">
                        A brief description about yourself.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex justify-end gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full sm:w-max"
                    disabled={isDeletingAccount}
                  >
                    {isDeletingAccount ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Account
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your account? This action
                      cannot be undone and will permanently remove your account
                      and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className={"w-full sm:w-max"}
              >
                {isUpdatingProfile ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
