"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle, User, KeyRound, Camera } from "lucide-react";
import { useGetUserAuth } from "@/api/user/queries";
import { useChangeProfilePicture } from "@/api/user/mutation";
import { UserProps } from "@/api/user/type";
import { Typography } from "@/components/atoms/typography/typography";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabProfile from "@/components/organisms/account/tabs/tab-profile";
import TabPassword from "@/components/organisms/account/tabs/tab-password";
import { getInitials } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { changeProfilePictureFormSchema } from "@/api/user/schema";
import { z } from "zod";
import { ProfileSkeleton } from "@/components/atoms/skeleton/account/skeleton-profile";

export default function EditProfile() {
  const { data, isLoading: isLoadingUserData } = useGetUserAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const userData = data as unknown as UserProps;
  const { mutate: updateAvatar, isPending: isUpdatingAvatar } =
    useChangeProfilePicture();

  const form = useForm<z.infer<typeof changeProfilePictureFormSchema>>({
    resolver: zodResolver(changeProfilePictureFormSchema),
    defaultValues: {
      photo: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof changeProfilePictureFormSchema>) => {
    const formData = new FormData();
    formData.append("avatar", values.photo);

    updateAvatar(formData, {
      onSuccess: () => {
        form.reset();
        setPreviewImage(null);
        setOpen(false);
      },
    });
  };

  if (isLoadingUserData) {
    return <ProfileSkeleton type="edit-profile" />;
  }

  if (!data) {
    return <ProfileSkeleton type="error" />;
  }

  return (
    <div className="space-y-6 my-4">
      <div className="grid grid-cols-1 sm:gap-6 gap-0 md:grid-cols-[250px_1fr]">
        {/* Left sidebar with user info */}
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {userData.photo ? (
                  <AvatarImage
                    src={userData.photo}
                    alt={userData.full_name_display || userData.username || ""}
                  />
                ) : (
                  <AvatarFallback className="text-lg">
                    {getInitials(
                      userData.full_name_display || userData.username,
                    )}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Avatar change button */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
                  >
                    <Camera size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Avatar</DialogTitle>
                    <DialogDescription>
                      Upload a new profile picture. Images must be less than
                      2MB.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="flex justify-center">
                        {previewImage ? (
                          <Image
                            src={previewImage}
                            alt="Avatar Preview"
                            width={200}
                            height={200}
                            className="rounded-full object-cover w-40 h-40"
                          />
                        ) : (
                          <Avatar className="h-40 w-40">
                            {userData.photo ? (
                              <AvatarImage
                                src={userData.photo}
                                alt={
                                  userData.full_name_display ||
                                  userData.username ||
                                  ""
                                }
                              />
                            ) : (
                              <AvatarFallback className="text-3xl">
                                {getInitials(
                                  userData.full_name_display ||
                                    userData.username,
                                )}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        )}
                      </div>
                      <FormField
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*"
                                className="cursor-pointer"
                                onChange={(e) => {
                                  handleFileChange(e);
                                  field.onChange(e.target.files?.[0]);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => {
                            form.reset();
                            setPreviewImage(null);
                            setOpen(false);
                          }}
                          disabled={isUpdatingAvatar}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!form.formState.isValid || isUpdatingAvatar}
                        >
                          {isUpdatingAvatar ? (
                            <>
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                              Uploading...
                            </>
                          ) : (
                            "Upload Avatar"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-1">
              <Typography className="font-medium">
                {userData.full_name_display || userData.username}
              </Typography>
              <Typography className="text-muted-foreground break-words">
                {userData.email}
              </Typography>
            </div>
          </div>

          {/* Account navigation tabs (for mobile/smaller screens) */}
          <div className="md:hidden">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Account navigation (for larger screens) */}
          <div className="hidden rounded-lg border p-3 md:block">
            <div className="space-y-1">
              <Button
                variant={activeTab === "profile" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === "password" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("password")}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Password
              </Button>
            </div>
          </div>
        </div>

        {/* Right content area */}
        <div className="space-y-6">
          {activeTab === "profile" ? <TabProfile /> : <TabPassword />}
        </div>
      </div>
    </div>
  );
}
